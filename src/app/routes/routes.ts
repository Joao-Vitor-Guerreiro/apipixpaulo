import { Router } from "express";
import { createPixController } from "../../controllers/create-pix";
import { getSicoobCheckout } from "../../controllers/sicoob";
import { createImageController } from "../../controllers/generate-image";
import { ofertaPaulo } from "../../controllers/ofertapaulo";
import { getElseveCheckout } from "../../controllers/elseve";
import { getTypebotPix } from "../../controllers/typebot";
import { ghostApiController } from "../../controllers/ghost";
import { clientController } from "../../controllers/clients";
import { webhookController } from "../../controllers/webhook";
import { prisma } from "../../config/prisma";
import { skalePixController } from "../../controllers/skale";
import { getSpotifyCheckout } from "../../controllers/spotify";

const ofertRouter = Router();

ofertRouter.post("/gerarpix", createPixController.create);

ofertRouter.get(
  "/sicoob-checkout/:cliente_id",
  getSicoobCheckout.receiveCheckout
);

ofertRouter.get("/get-voucher", createImageController.create);

ofertRouter.get("/gov", ofertaPaulo.create);

ofertRouter.get("/elseve/g/:cliente_id", getElseveCheckout.gustavo);

ofertRouter.get("/elseve/p/:cliente_id", getElseveCheckout.pedro);

ofertRouter.get("/elseve/k/:cliente_id", getElseveCheckout.kaue);

ofertRouter.get("/spotify/:cliente_id", getSpotifyCheckout.main);

ofertRouter.get("/typebot", getTypebotPix.receiveCheckout);

ofertRouter.post("/ghost", ghostApiController.create);
ofertRouter.post("/skale", skalePixController.create);

ofertRouter.post("/use-tax", clientController.useTax);

ofertRouter.get("/clients", clientController.getClients);
ofertRouter.get("/sales", clientController.getSales);
ofertRouter.get("/client/sales", clientController.getSalesFromClient);

// ofertRouter.get("/criarwb", async (req, res) => {
//   const token = "61000779-1d3d-451b-acee-21abab176851";

//   try {
//     // Busca todas as sales vinculadas ao client desse token
//     const client = await prisma.client.findUnique({
//       where: { token },
//       include: { sales: true },
//     });

//     if (!client) {
//       return res.status(404).json({ error: "Cliente não encontrado." });
//     }

//     const sales = client.sales;

//     let approvedCount = 0;

//     for (const sale of sales) {
//       try {
//         const response = await fetch(
//           `https://app.ghostspaysv1.com/api/v1/transaction.getPayment?id=${sale.ghostId}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: token,
//             },
//           }
//         );

//         const responseJson = await response.json();
//         console.log(responseJson);

//         if (responseJson.status === "APPROVED" && !sale.approved) {
//           await prisma.sale.update({
//             where: { id: sale.id },
//             data: { approved: true },
//           });
//           approvedCount++;
//         }
//       } catch (err) {
//         console.error(`Erro ao verificar status da venda ${sale.id}:`, err);
//       }
//     }

//     res.json({
//       message: `Sincronização concluída.`,
//       totalSales: sales.length,
//       approvedUpdated: approvedCount,
//     });
//   } catch (error) {
//     console.error("Erro ao sincronizar vendas:", error);
//     res.status(500).json({ error: "Erro interno ao sincronizar vendas." });
//   }
// });

ofertRouter.post("/webhook", webhookController.main);

export { ofertRouter };
