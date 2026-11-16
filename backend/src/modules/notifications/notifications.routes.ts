import { Router } from "express";
import { currentUser, requireAuth } from "../../common/auth";
import { notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { Notification } from "./notification.model";

export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);

notificationsRouter.get("/", async (req, res) => {
  send(res, (await Notification.find({ userId: currentUser(req).id }).sort({ createdAt: -1 }).limit(100)).map((n) => n.toJSON()));
});

notificationsRouter.post("/:id/read", async (req, res) => {
  const n = await Notification.findOneAndUpdate({ _id: req.params["id"], userId: currentUser(req).id }, { read: true }, { new: true });
  if (!n) throw notFound("Notification");
  send(res, n.toJSON());
});
