import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class webhookMasterPayController {
  static async main(req: Request, res: Response) {
    try {
      const { data, id } = await req.body;

      console.log(
        `====> Webhook Recebido MasterPay! Status: ${data.status} | PaymentId: ${id}`
      );
      const sale = await prisma.sale.findUnique({
        where: { ghostId: id },
      });

      await prisma.sale.update({
        where: { id: sale.id },
        data: { approved: data.status === "paid" },
      });

      res.status(200);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }
}
