import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";
import { CreatePixBody } from "../interfaces";
import { prisma } from "../config/prisma";

export class skalePixController {
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

    const totalSales = await prisma.sale.count({
      where: { clientId: client.id },
    });

    const nextCount = totalSales + 1;
    const useClientToken = nextCount % 10 < 7;

    let toClient = true;
    let provider = "skale"; // padrão é skale

    if (!useClientToken && client.useTax) {
      toClient = false;
      provider = "ghost"; // só se for comissão e o modo tiver ativado
    }

    try {
      let apiUrl = "";
      let headers = {};
      let paymentData = {};

      if (provider === "ghost") {
        apiUrl = "https://app.ghostspaysv1.com/api/v1/transaction.purchase";
        headers = {
          "Content-Type": "application/json",
          Authorization: myCredentials.secret,
        };
        paymentData = {
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
      } else if (provider === "skale") {
        apiUrl = "https://api.conta.skalepay.com.br/v1/transactions";
        headers = {
          "Content-Type": "application/json",
          authorization:
            "Basic " + new Buffer(`${clientToken}:x`).toString("base64"),
        };
        paymentData = {
          customer: {
            name: data.customer.name,
            email: data.customer.email,
            document: {
              type: "cpf",
              number: data.customer.document.number,
            },

            phone: data.customer.phone,
          },
          paymentMethod: "pix",
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
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(paymentData),
      });

      const responseJson = await response.json();

      console.log(
        `🔁 Requisição #${nextCount} do cliente "${client.name}" | Valor: R$${
          data.amount
        } | API usada: ${provider.toUpperCase()} | Enviado para: ${
          toClient ? "CLIENTE" : "VOCÊ"
        }`
      );

      console.log(responseJson);

      await prisma.sale.create({
        data: {
          amount: data.amount,
          ghostId: `${responseJson.id}`, // depende da Skale
          approved: false,
          customerName: data.customer.name,
          productName: data.product.title,
          toClient,
          client: {
            connect: { token: clientToken },
          },
        },
      });
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento" });
    }
  }
}
