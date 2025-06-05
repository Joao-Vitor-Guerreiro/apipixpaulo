import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export class clientController {
  static async useTax(req: Request, res: Response) {
    try {
      const { offerId, useTax } = await req.body;

      const offer = await prisma.offer.update({
        where: { id: offerId },
        data: { useTax },
      });

      res.json(offer);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }

  static async getClients(req: Request, res: Response) {
    try {
      const clients = await prisma.client.findMany({
        include: { sales: true, offers: { include: { sales: true } } },
      });

      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }

  static async getSales(req: Request, res: Response) {
    try {
      const sales = await prisma.sale.findMany({
        include: { client: true, offer: { include: { sales: true } } },
      });

      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }

  static async getSalesFromClient(req: Request, res: Response) {
    try {
      const { clientId } = req.body;

      const sales = await prisma.sale.findMany({
        where: { clientId },
        include: { client: true, offer: { include: { sales: true } } },
      });

      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }
}
