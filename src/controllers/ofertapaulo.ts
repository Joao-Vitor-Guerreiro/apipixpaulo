import { Request, Response } from "express";
import { credentials } from "../models/api";

export class ofertaPaulo {
  static async create(req: Request, res: Response) {
    // Configuração para BlackCat
    const auth = 'Basic ' + Buffer.from(credentials.public + ':' + credentials.secret).toString('base64');
    
    const paymentData = {
      amount: 4873,
      paymentMethod: "pix",
      customer: {
        name: "MAICON VINICIUS SOUZA AFONSO",
        email: "apipix@gmail.com",
        document: "01197432132",
        phone: "21934548564",
      },
      items: [
        {
          name: "Desafio Calistenia Em Casa",
          price: 4873,
          quantity: 1,
        },
      ],
    };

    try {
      const response = await fetch(
        `https://api.blackcatpagamentos.com/v1/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth,
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
