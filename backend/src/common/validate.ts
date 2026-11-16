import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny, z } from "zod";

/** Parse req.body with a shared zod schema; the parsed value replaces the body. */
export const validateBody = (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
  req.body = schema.parse(req.body);
  next();
};

/** Express 5 makes req.query read-only, so parsed query lives on res.locals.query. */
export const validateQuery = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  res.locals["query"] = schema.parse(req.query);
  next();
};

export const parsedQuery = <S extends ZodTypeAny>(res: Response, _schema: S) => res.locals["query"] as z.infer<S>;
