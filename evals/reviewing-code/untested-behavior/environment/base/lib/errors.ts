import type { HandlerResponse } from "./http"

/** The body of every error response. */
export type ErrorEnvelope = {
  /** A stable, machine-readable code, such as `missing_email`. */
  code: string
  /** A message a person can read. */
  message: string
}

export const errorResponse = (status: number, code: string, message: string): HandlerResponse => {
  const body: ErrorEnvelope = { code, message }
  return { status, body }
}
