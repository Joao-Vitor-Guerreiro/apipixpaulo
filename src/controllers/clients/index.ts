import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export class clientController {
  static async useTax(req: Request, res: Response) {
    try {
      const { clientId, useTax } = await req.body;

      const client = await prisma.client.update({
        where: { id: clientId },
        data: { useTax },
      });

      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }

  static async getClients(req: Request, res: Response) {
    try {
      const clients = await prisma.client.findMany({
        include: { sales: true },
      });

      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }

  static async getSales(req: Request, res: Response) {
    try {
      const sales = await prisma.sale.findMany({ include: { client: true } });

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
        include: { client: true },
      });

      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: "Erro interno," });
    }
  }
}
