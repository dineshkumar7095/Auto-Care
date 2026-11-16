import { Router } from "express";
import { currentUser, requireAuth } from "../../common/auth";
import { notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { User } from "./user.model";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(currentUser(req).id);
  if (!user) throw notFound("User");
  send(res, user.toJSON());
});
