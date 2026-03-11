export type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
};

export type JwtSigner = {
  sign(payload: Omit<JwtPayload, "iat">): string;
  verify(token: string): JwtPayload;
};
