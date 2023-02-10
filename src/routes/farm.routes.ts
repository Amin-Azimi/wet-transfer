import { RequestHandler, Router } from "express";
import { FarmsController } from "modules/farms/farms.controller";

const router = Router();
const controller = new FarmsController();

router.post("/", controller.create.bind(controller) as RequestHandler);
router.delete("/", controller.delete.bind(controller) as RequestHandler);
router.get("/", controller.get.bind(controller) as RequestHandler);

export default router;
