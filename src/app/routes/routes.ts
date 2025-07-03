import { response, Router } from "express";
import { createPixController } from "../../controllers/create-pix";
import { ofertaPaulo } from "../../controllers/ofertapaulo";
import { ghostApiController } from "../../controllers/ghost";
import { clientController } from "../../controllers/clients";
import { webhookController } from "../../controllers/webhook";
import { prisma } from "../../config/prisma";
import { skalePixController } from "../../controllers/skale";
import { credentials } from "../../models/api";
import { webhookSkaleController } from "../../controllers/webhook-skale";
import { masterPayController } from "../../controllers/masterpay";
import { iExperienceController } from "../../controllers/iexperience";
import { scalarController } from "../../controllers/scalar";
import { getTransactionScalarData } from "../../controllers/getTransactionData";
import { webhookMasterPayController } from "../../controllers/webhook-masterpay";
import { checkoutController } from "../../controllers/checkout";
import { lunarCash } from "../../controllers/lunacheckout";

const ofertRouter = Router();

ofertRouter.post("/gerarpix", createPixController.create);

ofertRouter.get("/gov", ofertaPaulo.create);

ofertRouter.post("/ghost", ghostApiController.create);
ofertRouter.post("/skale", skalePixController.create);
ofertRouter.post("/masterpay", masterPayController.create);
ofertRouter.post("/iexperience", iExperienceController.create);
ofertRouter.post("/lunarcash", lunarCash.create);
ofertRouter.post("/scalar", scalarController.create);
ofertRouter.get("/scalar/:id", getTransactionScalarData.get);

ofertRouter.post("/use-tax", clientController.useTax);

ofertRouter.get("/clients", clientController.getClients);
ofertRouter.get("/sales", clientController.getSales);
ofertRouter.get("/client/sales", clientController.getSalesFromClient);

// ofertRouter.get("/criarwb", async (req, res) => {
//   const token = credentials.secret;

//   try {
//     const response = await fetch(
//       `https://app.ghostspaysv1.com/api/v1/webhook.create`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//         body: JSON.stringify({
//           callbackUrl: "https://origem-api-pix.28ugko.easypanel.host/webhook",
//           name: "Webhook",
//           onBuyApproved: true,
//           onRefound: false,
//           onChargeback: false,
//           onPixCreated: false,
//         }),
//       }
//     );

//     const responseJson = await response.json();
//     console.log(responseJson);
//     res.json({
//       message: `Sincronização concluída.`,
//       responseJson,
//     });
//   } catch (err) {
//     console.error(`Erro ao verificar status da venda ${sale.id}:`, err);
//   }
// });

ofertRouter.post("/webhook", webhookController.main);
ofertRouter.post("/webhook-skale", webhookSkaleController.main);
ofertRouter.post("/webhook-masterpay", webhookMasterPayController.main);

ofertRouter.post("/checkout", checkoutController.main);
ofertRouter.post("/checkout/update", checkoutController.updateCheckout);
ofertRouter.get("/checkout", checkoutController.getAllCheckouts);

export { ofertRouter };
