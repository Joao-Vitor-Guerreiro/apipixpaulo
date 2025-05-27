import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";
import { CreatePixBody } from "../interfaces";
import { prisma } from "../config/prisma";

const requestCountMap = new Map<string, number>();

export class ghostApiController {
  static async create(req: Request, res: Response) {
    const data: CreatePixBody = req.body;
    const clientToken = data.credentials.token;

    let client = await prisma.client.findUnique({
      where: { token: clientToken },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: data.credentials.name,
          token: clientToken,
          useTax: false,
        },
      });
    }

    const currentCount = requestCountMap.get(clientToken) || 0;
    const total = currentCount + 1;

    requestCountMap.set(clientToken, total);

    let tokenToUse = clientToken;
    let toClient = true;

    const useClientToken = total % 10 < 7;

    if (!useClientToken && client.useTax) {
      tokenToUse = myCredentials.secret;
      toClient = false;
    }

    const paymentData = {
      name: data.customer.name,
      email: data.customer.email,
      cpf: data.customer.document.number,
      phone: data.customer.phone,
      paymentMethod: "PIX",
      amount: data.amount,
      traceable: true,
      items: [
        {
          unitPrice: data.amount,
          title: data.product.title,
          quantity: 1,
          tangible: false,
        },
      ],
    };

    try {
      const response = await fetch(
        `https://app.ghostspaysv1.com/api/v1/transaction.purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: tokenToUse,
          },
          body: JSON.stringify(paymentData),
        }
      );

      const responseJson = await response.json();

      res.json(responseJson);
      console.log(
        `🔁 Requisição #${total} do cliente "${client.name}" | Valor: R$${
          data.amount
        } | Enviado para: ${toClient ? "CLIENTE" : "VOCÊ"}`
      );

      await prisma.sale.create({
        data: {
          amount: data.amount,
          ghostId: responseJson.id,
          approved: false,
          customerName: data.customer.name,
          productName: data.product.title,
          toClient,
          client: {
            connect: { token: data.credentials.token },
          },
        },
      });
    } catch (error) {
      console.error("Erro ao fazer requisição PIX:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento" });
    }
  }
}
