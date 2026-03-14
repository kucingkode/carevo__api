export type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
};

export type JwtSigner = {
  sign(payload: Omit<JwtPayload, "iat">): Promise<string>;
  verify(token: string): Promise<JwtPayload>;
};
