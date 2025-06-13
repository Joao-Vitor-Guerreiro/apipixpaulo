import { Request, Response } from "express";

export class getTransactionScalarData {
  static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const response = await fetch(
        `https://app.pluggou.io/api/payments/transactions?organizationId=X35AtBs7YNeBlGvoFa1NT`,
        {
          headers: {
            "X-API-Key": "pk_live_VC8yyiBfwWmtxcC3EbVPhip_D_HxMKtK",
          },
        }
      );

      if (!response.ok) console.log(response);

      const responseJson = await response.json();

      const filtered = responseJson.data.filter((result) => result.id === id);

      res.json(filtered[0]);
    } catch (error: any) {
      console.error("Erro em useTax:", error);
      res.status(500).json({ error: "Erro interno", details: error.message });
    }
  }
}
