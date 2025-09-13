export type AccessTokenPayload = {
  userId: string;
  email:string;
  role:string|null;
};

export type RefreshTokenPayload = {
  userId:string;
}

export type Session = {
  id: string;
  email: string;
};
