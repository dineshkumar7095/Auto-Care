import { Router } from "express";
import { VENDOR_STATUSES } from "@automotive/shared-types";
import { vendorApplicationSchema, vendorDecisionSchema } from "@automotive/validation";
import { z } from "zod";
import { currentUser, requireAuth, requirePermission, requirePortal } from "../../common/auth";
import { conflict, notFound } from "../../common/http-error";
import { send } from "../../common/respond";
import { parsedQuery, validateBody, validateQuery } from "../../common/validate";
import { audit } from "../audit/audit.model";
import { Vendor } from "./vendor.model";

export const vendorsRouter = Router();
const listQuery = z.object({ status: z.enum(VENDOR_STATUSES).optional() });

/** Partner onboarding: anyone signed in can apply; the application starts as pending. */
vendorsRouter.post("/applications", requireAuth, validateBody(vendorApplicationSchema), async (req, res) => {
  const v = await Vendor.create({ ...req.body, status: "pending", documents: [] });
  await audit(currentUser(req).id, "vendor.applied", "vendor", v._id);
  send(res, v.toJSON(), 201);
});

vendorsRouter.get("/", requireAuth, requirePortal("admin-portal"), validateQuery(listQuery), async (_req, res) => {
  const { status } = parsedQuery(res, listQuery);
  const list = await Vendor.find(status ? { status } : {}).sort({ submittedAt: -1 });
  send(res, list.map((v) => v.toJSON()));
});

vendorsRouter.post("/:id/decision", requireAuth, requirePermission("partners:approve"), validateBody(vendorDecisionSchema), async (req, res) => {
  const v = await Vendor.findById(req.params["id"]);
  if (!v) throw notFound("Partner");
  if (req.body.decision === "approve" && v.documents.some((d) => !d.verified)) throw conflict("documents_missing", "All documents must be verified first");
  v.status = req.body.decision === "approve" ? "approved" : "rejected";
  await v.save();
  await audit(currentUser(req).id, `vendor.${v.status}`, "vendor", v._id, req.body.note);
  send(res, v.toJSON());
});
