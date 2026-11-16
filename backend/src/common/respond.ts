import type { Response } from "express";
import type { ApiSuccess } from "@automotive/shared-types";

/** Every success response uses the shared `{ ok: true, data }` envelope. */
export const send = <T>(res: Response, data: T, status = 200) => res.status(status).json({ ok: true, data } satisfies ApiSuccess<T>);
