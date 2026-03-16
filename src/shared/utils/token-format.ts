export function stringifyToken(id: string, secret: string) {
  return `${id}.${secret}`;
}

export function parseToken(token: string) {
  const [id, secret] = token.split(".");

  return {
    id,
    secret,
  };
}
