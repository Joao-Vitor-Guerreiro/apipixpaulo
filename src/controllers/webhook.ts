import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class webhookController {
  static async main(req: Request, res: Response) {
    try {
      const { status, paymentId } = await req.body;

      console.log(
        `====> Webhook Recebido! Status: ${status} | PaymentId: ${paymentId}`
      );
      const sale = await prisma.sale.findUnique({
        where: { ghostId: paymentId },
      });

      await prisma.sale.update({
        where: { id: sale.id },
        data: { approved: status === "APPROVED" },
      });

      res.status(200);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }
}
