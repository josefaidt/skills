/** What a handler returns, before the server turns it into an HTTP response. */
export type HandlerResponse = {
  /** The HTTP status code. */
  status: number
  /** The JSON body. */
  body: unknown
}
