import { Router } from "express";
import { vehicleInputSchema } from "@automotive/validation";
import { currentUser, requireAuth } from "../../common/auth";
import { notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { validateBody } from "../../common/validate";
import { Vehicle } from "./vehicle.model";

export const vehiclesRouter = Router();
vehiclesRouter.use(requireAuth);

vehiclesRouter.get("/", async (req, res) => {
  send(res, (await Vehicle.find({ ownerId: currentUser(req).id })).map((v) => v.toJSON()));
});
vehiclesRouter.post("/", validateBody(vehicleInputSchema), async (req, res) => {
  send(res, (await Vehicle.create({ ...req.body, ownerId: currentUser(req).id })).toJSON(), 201);
});
vehiclesRouter.delete("/:id", async (req, res) => {
  const r = await Vehicle.deleteOne({ _id: req.params["id"], ownerId: currentUser(req).id });
  if (!r.deletedCount) throw notFound("Vehicle");
  send(res, { deleted: true });
});
