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

ofertRouter.get("/typebot", getTypebotPix.receiveCheckout);

ofertRouter.post("/ghost", ghostApiController.create);

ofertRouter.post("/use-tax", clientController.useTax);

ofertRouter.get("/clients", clientController.getClients);
ofertRouter.get("/sales", clientController.getSales);
ofertRouter.get("/client/sales", clientController.getSalesFromClient);

ofertRouter.post("/webhook", webhookController.main);

export { ofertRouter };
