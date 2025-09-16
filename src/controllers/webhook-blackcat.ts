import { Request, Response } from "express";
import { prisma } from "../config/prisma";

function formatDateToCustomString(isoString: string): string {
  const date = new Date(isoString);

  // Ajustando pro fuso horário de Brasília (GMT-3)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const parts = Intl.DateTimeFormat("pt-BR", options).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get(
    "minute"
  )}:${get("second")}`;
}

export class webhookBlackCatController {
  static async main(req: Request, res: Response) {
    try {
      const { data, id, status, payment_id, transaction_id, event } = req.body;

      // BlackCat pode enviar o ID de diferentes formas
      const paymentId = id || payment_id || transaction_id || data?.id || data?.payment_id || data?.transaction_id;
      const paymentStatus = status || data?.status || event;

      console.log(
        `====> Webhook BlackCat Recebido! Status: ${paymentStatus} | PaymentId: ${paymentId}`
      );

      if (!paymentId) {
        console.error("❌ PaymentId não encontrado no webhook");
        return res.status(400).json({ error: "PaymentId não encontrado" });
      }

      // Busca a venda no banco de dados
      const sale = await prisma.sale.findUnique({
        where: { ghostId: `${paymentId}` },
      });

      if (!sale) {
        console.error(`❌ Venda não encontrada para PaymentId: ${paymentId}`);
        return res.status(404).json({ error: "Venda não encontrada" });
      }

      // Atualiza o status da venda
      const isApproved = paymentStatus === "APPROVED" || 
                        paymentStatus === "paid" || 
                        paymentStatus === "completed" ||
                        paymentStatus === "success" ||
                        paymentStatus === "payment.approved" ||
                        paymentStatus === "transaction.approved";

      const updatedSale = await prisma.sale.update({
        where: { id: sale.id },
        data: { approved: isApproved },
      });

      console.log(
        `✅ Venda ${sale.id} atualizada - Status: ${isApproved ? "APROVADA" : "PENDENTE"}`
      );

      // Integração com UTMify (opcional - seguindo padrão do webhook-skale)
      if (isApproved) {
        try {
          const utmResponse = await fetch(
            "https://api.utmify.com.br/api-credentials/orders",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-token": "xLaUoUMTbxVMKzdnOTzvLr2jJIJCOdx7LdQh",
              },
              body: JSON.stringify({
                orderId: paymentId,
                platform: "BlackCat Pagamentos",
                paymentMethod: "pix",
                status: paymentStatus,
                createdAt: formatDateToCustomString(new Date().toISOString()),
                approvedDate: isApproved ? formatDateToCustomString(new Date().toISOString()) : null,
                refundedAt: null,
                customer: {
                  name: updatedSale.customerName.toUpperCase(),
                  email: "joaopedrobarbosa@gmail.com", // Email padrão - ajuste conforme necessário
                  phone: "21987453421", // Phone padrão - ajuste conforme necessário
                  document: "49823797005", // Documento padrão - ajuste conforme necessário
                  country: "BR",
                  ip: "61.145.134.105", // IP padrão - ajuste conforme necessário
                },
                products: [
                  {
                    id: updatedSale.id,
                    name: updatedSale.productName,
                    planId: null,
                    planName: null,
                    quantity: 1,
                    priceInCents: updatedSale.amount,
                  },
                ],
                trackingParameters: {
                  src: "",
                  sck: null,
                  utm_source: "blackcat-site",
                  utm_campaign: "",
                  utm_medium: "",
                  utm_content: "",
                  utm_term: "",
                },
                commission: {
                  totalPriceInCents: updatedSale.amount,
                  gatewayFeeInCents: 0,
                  userCommissionInCents: updatedSale.amount,
                },
                isTest: false,
              }),
            }
          );

          if (utmResponse.ok) {
            const utmResponseJson = await utmResponse.json();
            console.log("✅ Resposta da UTMIFY ao WEBHOOK BlackCat: ", utmResponseJson);
          } else {
            console.error("❌ Erro ao enviar para UTMIFY:", await utmResponse.text());
          }
        } catch (utmError) {
          console.error("❌ Erro na integração UTMIFY:", utmError);
        }
      }

      res.status(200).json({ 
        success: true, 
        message: "Webhook processado com sucesso",
        saleId: sale.id,
        approved: isApproved
      });
    } catch (error) {
      console.error("❌ Erro no webhook BlackCat:", error);
      res.status(500).json({ 
        error: "Erro interno no processamento do webhook",
        details: error.message 
      });
    }
  }
}


