export type JWTPayload = {
  id: string;
  expiresAt?: Date;
};

export type Session = {
  id: string;
  email: string;
};
