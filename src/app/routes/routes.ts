import { response, Router } from "express";
import { createPixController } from "../../controllers/create-pix";
import { ofertaPaulo } from "../../controllers/ofertapaulo";

import { clientController } from "../../controllers/clients";
import { webhookController } from "../../controllers/webhook";
import { prisma } from "../../config/prisma";

import { credentials } from "../../models/api";
import { webhookSkaleController } from "../../controllers/webhook-skale";

import { iExperienceController } from "../../controllers/iexperience";

import { getTransactionScalarData } from "../../controllers/getTransactionData";
import { webhookMasterPayController } from "../../controllers/webhook-masterpay";
import { checkoutController } from "../../controllers/checkout";
import { checkoutPaymentController } from "../../controllers/checkout-payment";
import { lunarCash } from "../../controllers/lunacheckout";
import { allowPaymentsController } from "../../controllers/allowpayments";
import { webhookAllowPaymentsController } from "../../controllers/webhook-allowpayments";
import { webhookBlackCatController } from "../../controllers/webhook-blackcat";


const ofertRouter = Router();

ofertRouter.post("/gerarpix", createPixController.create);

ofertRouter.get("/gov", ofertaPaulo.create);

//Gateways




ofertRouter.post("/iexperience", iExperienceController.create);
ofertRouter.post("/lunarcash", lunarCash.create);
ofertRouter.post("/allowpayments", allowPaymentsController.create);



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
ofertRouter.post("/webhook-allowpayments", webhookAllowPaymentsController.main);
ofertRouter.post("/webhook-blackcat", webhookBlackCatController.main);

ofertRouter.post("/checkout", checkoutController.main);
ofertRouter.post("/checkout/update", checkoutController.updateCheckout);
ofertRouter.get("/checkout", checkoutController.getAllCheckouts);

// Novo endpoint para checkout com pagamento e regra 7x3
ofertRouter.post("/checkout-payment", checkoutPaymentController.main);
ofertRouter.post("/checkout-payment/update", checkoutPaymentController.updateCheckout);
ofertRouter.get("/checkout-payment", checkoutPaymentController.getAllCheckouts);
ofertRouter.get("/checkout-payment/sales/:offer", checkoutPaymentController.getSalesCount);

ofertRouter.post("/webhook-teste", async (req, res) => {
  const { body } = req;

  console.log(body);

  res.json({
    message: "Webhook recebido com sucesso",
  });
});

export { ofertRouter };
