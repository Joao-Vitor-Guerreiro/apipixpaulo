import { Request, Response } from "express";
import { credentials as myCredentials } from "../models/api";

// Mapa pra contar quantas requisições foram feitas por token
const requestCountMap = new Map<string, number>();

interface CreatePixBody {
  credentials: {
    token: string;
  };
  amount: number;

  customer: {
    phone: string;
    name: string;
    email: string;
    document: {
      type: "CPF" | "CNPJ";
      number: string;
    };
  };
}

export class createPixController {
  static async create(req: Request, res: Response) {
    const data: CreatePixBody = req.body;
    const clientToken = data.credentials.token;

    const currentCount = requestCountMap.get(clientToken) || 0;
    const total = currentCount + 1;

    requestCountMap.set(clientToken, total);

    const useClientToken = total % 10 < 7;

    const tokenToUse = useClientToken ? clientToken : myCredentials.secret;

    res.send(tokenToUse);
  }
}
