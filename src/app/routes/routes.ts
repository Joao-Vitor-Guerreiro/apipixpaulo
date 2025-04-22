import { Router } from "express";
import { createPixController } from "../../controllers/create-pix";
import { getSicoobCheckout } from "../../controllers/sicoob";

const ofertRouter = Router();

ofertRouter.post("/gerarpix", createPixController.create);

ofertRouter.get(
  "/sicoob-checkout/:cliente_id",
  getSicoobCheckout.receiveCheckout
);

export { ofertRouter };
