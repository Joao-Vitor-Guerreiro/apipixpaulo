import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export class webhookBlackCatController {
  static async main(req: Request, res: Response) {
    try {
      // ⚠️ CONFIGURE AQUI COMO O WEBHOOK DO BLACKCAT ENVIA OS DADOS
      const { status, id, transaction_id, payment_id } = req.body;

      console.log(
        `====> Webhook BlackCat Recebido! Status: ${status} | PaymentId: ${id || transaction_id || payment_id}`
      );

      // ⚠️ ALTERE AQUI O CAMPO QUE IDENTIFICA A VENDA
      const saleId = id || transaction_id || payment_id;
      
      const sale = await prisma.sale.findUnique({
        where: { ghostId: `${saleId}` },
      });

      if (!sale) {
        console.log("❌ Venda não encontrada:", saleId);
        return res.status(404).json({ error: "Venda não encontrada" });
      }

      // ⚠️ ALTERE AQUI A LÓGICA DE APROVAÇÃO DO BLACKCAT
      const isApproved = status === "paid" || status === "APPROVED" || status === "approved" || status === "completed";

      await prisma.sale.update({
        where: { id: sale.id },
        data: { approved: isApproved },
      });

      console.log(
        `✅ Venda ${sale.id} atualizada: ${isApproved ? "APROVADA" : "REJEITADA"}`
      );

      // ⚠️ OPCIONAL: Adicione integrações adicionais aqui
      // Exemplo: enviar para UTMify, enviar email, etc.

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Erro no webhook BlackCat:", error);
      res.status(500).json({ error: "Erro interno no webhook" });
    }
  }
}


