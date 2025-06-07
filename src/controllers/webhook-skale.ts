import { Request, Response } from "express";
import { prisma } from "../config/prisma";

function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // meses começam do zero
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export class webhookSkaleController {
  static async main(req: Request, res: Response) {
    try {
      const { data, id } = await req.body;

      console.log(
        `====> Webhook Skale Recebido! Status: ${data.status} | PaymentId: ${data.id} `
      );
      const sale = await prisma.sale.findUnique({
        where: { ghostId: data.id },
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
            "x-api-token": "xLaUoUMTbxVMKzdnOTzvLr2jJIJCOdx7LdQh",
          },
          body: JSON.stringify({
            orderId: data.id,
            platform: "Skale",
            paymentMethod: "pix",
            status: data.status,
            createdAt: getCurrentDateTime(),
            approvedDate: null,
            refundedAt: null,
            customer: {
              name: updatedSale.customerName.toUpperCase(),
              email: "email345gmail453out@gmail.com",
              phone: "21987453421",
              document: "98473623154",
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
              src: "checkpixdomilhao",
              sck: null,
              utm_source: "oferta-pixdomilhao",
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

      const utmResponseJson = await utmResponse.json();
      console.log("Resposta da UTMIFY ao WEBHOOK: ", utmResponseJson);

      res.status(200);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }
}
