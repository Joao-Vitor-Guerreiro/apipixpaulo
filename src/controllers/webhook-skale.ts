import { Request, Response } from "express";
import { prisma } from "../config/prisma";

async function getCurrentDateTimeFromAPI(timezone = "America/Sao_Paulo") {
  try {
    const response = await fetch(
      `https://worldtimeapi.org/api/timezone/${timezone}`
    );
    const data = await response.json();

    // data.datetime vem no formato ISO: "2025-06-06T23:58:13.123456-03:00"
    const date = new Date(data.datetime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Erro ao buscar data da API:", error);
    return null;
  }
}

export class webhookSkaleController {
  static async main(req: Request, res: Response) {
    try {
      const { data, id } = req.body;

      console.log(
        `====> Webhook Skale Recebido! Status: ${data.status} | PaymentId: ${data.id} `
      );
      const sale = await prisma.sale.findUnique({
        where: { ghostId: data.id },
      });

      const dateTime = await getCurrentDateTimeFromAPI();

      console.log("Data teste", dateTime);

      const updatedSale = await prisma.sale.update({
        where: { id: sale.id },
        data: { approved: data.status === "paid" },
      });

      console.log(updatedSale);

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
            createdAt: dateTime,
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
      console.log(utmResponse);
      const utmResponseJson = await utmResponse.json();
      console.log("Resposta da UTMIFY ao WEBHOOK: ", utmResponseJson);

      res.status(200);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}
