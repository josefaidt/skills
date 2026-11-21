type Fields = Record<string, string | number | boolean | null>

const write = (level: "info" | "warn", message: string, fields: Fields): void => {
  console.log(JSON.stringify({ level, message, ...fields }))
}

export const logger = {
  info: (message: string, fields: Fields = {}): void => write("info", message, fields),
  warn: (message: string, fields: Fields = {}): void => write("warn", message, fields),
}
