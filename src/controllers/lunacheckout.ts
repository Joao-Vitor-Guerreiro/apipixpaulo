import { Request, Response } from "express";
import { CreatePixBody } from "../interfaces";
import { prisma } from "../config/prisma";

const FIXED_TAX_TOKEN = "5acb6e5c-5e8c-4136-bab2-5a66ea2b8a81";

export class lunaCheckoutController {
  static async create(req: Request, res: Response) {
    const data: CreatePixBody = req.body;
    const clientToken = data.credentials.token;


    // 5️⃣ Dados da cobrança
    const paymentData = {
      name: 'João Pedro de Oliveira Marques',
      email: 'marquesjoaooo@gmail.com',
      cpf: '094.776.795-93',
      phone: '21987463726',
      paymentMethod: "PIX",
      amount: data.amount,
      traceable: true,
      items: [
        {
          unitPrice: data.amount,
          title: 'Doação ONG - Vakinha',
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
            Authorization: clientToken,
          },
          body: JSON.stringify(paymentData),
        }
      );

      const responseJson = await response.json();
 
      

      res.json(responseJson);
    } catch (error) {
      console.error("💥 Erro ao fazer requisição PIX:", error);
      res.status(500).json({ error: "Erro interno na API de pagamento", json: error });
    }
  }
}
