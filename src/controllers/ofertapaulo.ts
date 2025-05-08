import { Request, Response } from "express";

export class ofertaPaulo {
  static async create(req: Request, res: Response) {
    const paymentData = {
      name: "MAICON VINICIUS SOUZA AFONSO",
      email: "apipix@gmail.com",
      cpf: "01197432132",
      phone: "21934548564",
      paymentMethod: "PIX",
      amount: 4873,
      traceable: true,
      items: [
        {
          unitPrice: 4873,
          title: "Desafio Calistenia Em Casa",
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
            Authorization: "e449db57-934f-4b2b-b137-126d34d02e34",
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
