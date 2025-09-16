import { cars } from '@repo/db';
import z from 'zod';

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

export type Car = {
  id: string;
  make: string;
  model: string;
  registrationNumber: string;
  insuranceEndDate: Date;
  inspectionEndDate: Date;
  createdBy: string;
};
