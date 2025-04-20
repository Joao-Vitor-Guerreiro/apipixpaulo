import { Router } from "express";
import { createPixController } from "../../controllers/create-pix";

const router = Router();

router.post("/gerarpix", createPixController.create);

export { router };
