import { Request, Response } from "express";

// VARIÁVEL DE CONTROLE: Ativa ou desativa o modo comissão (7x3)
const usarModoComissao = true;

const historicoPorCliente = new Map<string, { total: number; meus: number }>();

const checkoutPaulo =
  "https://pay.compraaegurapay.com/checkout/06890f4f-5dbd-4648-92fe-08b341426de0";

export class getElseveCheckout {
  static async pedro(req: Request, res: Response) {
    const { cliente_id } = req.query;

    const linkDoCliente =
      "https://pay.compraeguraapay.com/checkout/8af1bfa2-470f-4a61-9d70-613e0ed846e8";
    const meuLink = checkoutPaulo;

    if (!cliente_id || typeof cliente_id !== "string") {
       res
        .status(400)
        .json({ error: "cliente_id é obrigatório na query!" });
    }

    // SE o modo comissão estiver DESATIVADO, já retorna o link do cliente direto
    if (!usarModoComissao) {
       res.json({
        link_checkout: linkDoCliente,
        origem: "cliente_link",
        info: "Modo comissão desativado",
      });
    }

    // CONTINUA o modo 7x3 se estiver ativado
    const historico = historicoPorCliente.get(cliente_id) || {
      total: 0,
      meus: 0,
    };
    historico.total++;

    let usarMeuLink = false;
    const proporcaoAtual = historico.meus / historico.total;

    if (proporcaoAtual < 0.3) {
      usarMeuLink = true;
      historico.meus++;
    }

    historicoPorCliente.set(cliente_id, historico);

    const linkFinal = usarMeuLink ? meuLink : linkDoCliente;

    res.json({
      link_checkout: linkFinal,
      origem: usarMeuLink ? "meu_link" : "cliente_link",
      estatistica: historicoPorCliente.get(cliente_id),
    });
  }

  static async kaue(req: Request, res: Response) {
    const { cliente_id } = req.query;

    const linkDoCliente =
      "https://pay.compraeguraapay.com/checkout/b48a0761-2f91-48ae-b539-79237c550560";
    const meuLink = checkoutPaulo;

    if (!cliente_id || typeof cliente_id !== "string") {
       res
        .status(400)
        .json({ error: "cliente_id é obrigatório na query!" });
    }

    // SE o modo comissão estiver DESATIVADO, já retorna o link do cliente direto
    if (!usarModoComissao) {
       res.json({
        link_checkout: linkDoCliente,
        origem: "cliente_link",
        info: "Modo comissão desativado",
      });
    }

    // CONTINUA o modo 7x3 se estiver ativado
    const historico = historicoPorCliente.get(cliente_id) || {
      total: 0,
      meus: 0,
    };
    historico.total++;

    let usarMeuLink = false;
    const proporcaoAtual = historico.meus / historico.total;

    if (proporcaoAtual < 0.3) {
      usarMeuLink = true;
      historico.meus++;
    }

    historicoPorCliente.set(cliente_id, historico);

    const linkFinal = usarMeuLink ? meuLink : linkDoCliente;

    res.json({
      link_checkout: linkFinal,
      origem: usarMeuLink ? "meu_link" : "cliente_link",
      estatistica: historicoPorCliente.get(cliente_id),
    });
  }

  static async gustavo(req: Request, res: Response) {
    const { cliente_id } = req.query;

    const linkDoCliente =
      "https://pay.compraeguraapay.com/checkout/19e2b46a-26c5-4b7b-9609-45440f1ccea7";
    const meuLink = checkoutPaulo;

    if (!cliente_id || typeof cliente_id !== "string") {
       res
        .status(400)
        .json({ error: "cliente_id é obrigatório na query!" });
    }

    // SE o modo comissão estiver DESATIVADO, já retorna o link do cliente direto
    if (!usarModoComissao) {
       res.json({
        link_checkout: linkDoCliente,
        origem: "cliente_link",
        info: "Modo comissão desativado",
      });
    }

    // CONTINUA o modo 7x3 se estiver ativado
    const historico = historicoPorCliente.get(cliente_id) || {
      total: 0,
      meus: 0,
    };
    historico.total++;

    let usarMeuLink = false;
    const proporcaoAtual = historico.meus / historico.total;

    if (proporcaoAtual < 0.3) {
      usarMeuLink = true;
      historico.meus++;
    }

    historicoPorCliente.set(cliente_id, historico);

    const linkFinal = usarMeuLink ? meuLink : linkDoCliente;

    res.json({
      link_checkout: linkFinal,
      origem: usarMeuLink ? "meu_link" : "cliente_link",
      estatistica: historicoPorCliente.get(cliente_id),
    });
  }
}
