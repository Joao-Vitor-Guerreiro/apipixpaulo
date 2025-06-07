import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export class clientController {
  static async useTax(req: Request, res: Response) {
    try {
      const { offerId, useTax } = req.body;

      const offer = await prisma.offer.update({
        where: { id: offerId },
        data: { useTax },
      });

      res.json(offer);
    } catch (error: any) {
      console.error("Erro em useTax:", error);
      res.status(500).json({ error: "Erro interno", details: error.message });
    }
  }

  static async getClients(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;

      const clients = await prisma.client.findMany({
        skip: offset,
        take: limit,
        include: {
          sales: true,
          offers: {
            include: {
              sales: true,
            },
          },
        },
      });

      res.json(clients);
    } catch (error: any) {
      console.error("Erro em getClients:", error);
      res.status(500).json({ error: "Erro interno", details: error.message });
    }
  }

  static async getSales(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;

      const sales = await prisma.sale.findMany({
        skip: offset,
        take: limit,
        include: {
          client: true,
          offer: {
            include: {
              sales: true,
            },
          },
        },
      });

      res.json(sales);
    } catch (error: any) {
      console.error("Erro em getSales:", error);
      res.status(500).json({ error: "Erro interno", details: error.message });
    }
  }

  static async getSalesFromClient(req: Request, res: Response) {
    try {
      const { clientId } = req.body;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;

      const sales = await prisma.sale.findMany({
        where: { clientId },
        skip: offset,
        take: limit,
        include: {
          client: true,
          offer: {
            include: {
              sales: true,
            },
          },
        },
      });

      res.json(sales);
    } catch (error: any) {
      console.error("Erro em getSalesFromClient:", error);
      res.status(500).json({ error: "Erro interno", details: error.message });
    }
  }
}
