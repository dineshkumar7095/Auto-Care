import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import type { ApiFailure } from "@automotive/shared-types";
import { TransitionError } from "@automotive/utilities";
import { HttpError } from "./http-error";

const fail = (res: Response, status: number, code: string, message: string, details?: unknown) =>
  res.status(status).json({ ok: false, error: { code, message, details } } satisfies ApiFailure);

export function notFoundHandler(req: Request, res: Response) {
  fail(res, 404, "route_not_found", `${req.method} ${req.path} is not part of the API`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) return fail(res, err.status, err.code, err.message, err.details);
  if (err instanceof ZodError) return fail(res, 422, "validation_error", err.issues[0]?.message ?? "Invalid input", err.flatten());
  if (err instanceof TransitionError) return fail(res, 409, "invalid_transition", err.message);
  if (err instanceof mongoose.Error.ValidationError) return fail(res, 422, "validation_error", err.message);
  if (err instanceof mongoose.Error.CastError) return fail(res, 400, "bad_request", "Invalid id");
  console.error(err);
  return fail(res, 500, "internal_error", "Something went wrong on our side");
}
