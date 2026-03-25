import sanitizeHtml_ from "sanitize-html";

export function sanitizeHtml(value: string) {
  if (!value) return;
  return sanitizeHtml_(value);
}

export function sanitizeHtmlObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeHtml(value);
    }
  }

  return sanitized;
}
