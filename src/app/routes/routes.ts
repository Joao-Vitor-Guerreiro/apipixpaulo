import { Router } from "express";
import { createPixController } from "../../controllers/create-pix";
import { getSicoobCheckout } from "../../controllers/sicoob";
import { createImageController } from "../../controllers/generate-image";
import { ofertaPaulo } from "../../controllers/ofertapaulo";
import { getElseveCheckout } from "../../controllers/elseve";

const ofertRouter = Router();

ofertRouter.post("/gerarpix", createPixController.create);

ofertRouter.get(
  "/sicoob-checkout/:cliente_id",
  getSicoobCheckout.receiveCheckout
);

ofertRouter.get("/get-voucher", createImageController.create);

ofertRouter.get("/ofertapaulo", ofertaPaulo.create);

ofertRouter.get("/elseve/g/:cliente_id", getElseveCheckout.gustavo);

ofertRouter.get("/elseve/p/:cliente_id", getElseveCheckout.pedro);

ofertRouter.get("/elseve/k/:cliente_id", getElseveCheckout.kaue);

export { ofertRouter };
