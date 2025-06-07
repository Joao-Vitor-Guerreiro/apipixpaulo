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

  const parts = new Intl.DateTimeFormat("pt-BR", options).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get(
    "minute"
  )}:${get("second")}`;
}

export class webhookSkaleController {
  static async main(req: Request, res: Response) {
    try {
      const { data, id } = req.body;

      console.log(
        `====> Webhook Skale Recebido! Status: ${data.status} | PaymentId: ${data.id} `
      );
      const sale = await prisma.sale.findUnique({
        where: { ghostId: `${data.id}` },
      });

      const updatedSale = await prisma.sale.update({
        where: { id: sale.id },
        data: { approved: data.status === "paid" },
      });

      const utmResponse = await fetch(
        "https://api.utmify.com.br/api-credentials/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": "xLaUoUMTbxVMKzdnOTzvLr2jJIJCOdx7LdQh",
          },
          body: JSON.stringify({
            orderId: data.id,
            platform: "Skale",
            paymentMethod: "pix",
            status: data.status,
            createdAt: formatDateToCustomString(data.createdAt),
            approvedDate: null,
            refundedAt: null,
            customer: {
              name: updatedSale.customerName.toUpperCase(),
              email: "joaopedrobarbosa@gmail.com",
              phone: "21987453421",
              document: "49823797005",
              country: "BR",
              ip: "61.145.134.105",
            },
            products: [
              {
                id: updatedSale.id,
                name: `PIX DO MILHÃO - EBOOK`,
                planId: null,
                planName: null,
                quantity: 1,
                priceInCents: updatedSale.amount,
              },
            ],
            trackingParameters: {
              src: "",
              sck: null,
              utm_source: "pixdomilhao-site",
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
            isTest: true,
          }),
        }
      );

      const utmResponseJson = await utmResponse.json();
      console.log("Resposta da UTMIFY ao WEBHOOK: ", utmResponseJson);

      res.status(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  }
}
