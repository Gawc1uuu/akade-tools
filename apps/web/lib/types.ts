export type AccessTokenPayload = {
  userId: string;
  email: string;
  role: string | null;
  organizationId: string;
};

export type RefreshTokenPayload = {
  userId: string;
};

export type Session = {
  id: string;
  email: string;
};
