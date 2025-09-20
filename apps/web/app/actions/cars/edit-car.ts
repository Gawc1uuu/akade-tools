'use server';

import { cars, db } from '@repo/db';
import { parse } from 'date-fns';
import { pl } from 'date-fns/locale';
import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { getToken, verifyToken } from '~/lib/tokens';

export type EditCarState = {
  success: boolean;
  errors: {
    id?: string[];
    make?: string[];
    model?: string[];
    registrationNumber?: string[];
    insuranceEndDate?: string[];
    inspectionEndDate?: string[];
    other?: string[];
  };
  data?: {
    id?: string;
    make?: string;
    model?: string;
    registrationNumber?: string;
    insuranceEndDate?: string;
    inspectionEndDate?: string;
  };
};

const editCarSchema = z.object({
  id: z.string().min(1, { message: 'ID jest wymagane' }),
  make: z.string().min(1, { message: 'Marka jest wymagana' }),
  model: z.string().min(1, { message: 'Model jest wymagany' }),
  registrationNumber: z.string().min(1, { message: 'Numer rejestracyjny jest wymagany' }),
  insuranceEndDate: z.string().min(1, { message: 'Data końca ubezpieczenia jest wymagana' }),
  inspectionEndDate: z.string().min(1, { message: 'Data końca przeglądu jest wymagana' }),
});

export async function editCar(currentState: EditCarState, formData: FormData): Promise<EditCarState> {
  const token = await getToken();
  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    return {
      success: false,
      errors: {
        other: ['Nieprawidłowy token'],
        make: [],
        model: [],
        registrationNumber: [],
        insuranceEndDate: [],
        inspectionEndDate: [],
      },
      data: currentState.data,
    };
  }

  const parsed = editCarSchema.safeParse({
    id: formData.get('id'),
    make: formData.get('make'),
    model: formData.get('model'),
    registrationNumber: formData.get('registrationNumber'),
    insuranceEndDate: formData.get('insuranceEndDate'),
    inspectionEndDate: formData.get('inspectionEndDate'),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      data: currentState.data,
    };
  }

  const insuranceEndDate = parse(parsed.data.insuranceEndDate, 'dd MMMM yyyy', new Date(), {
    locale: pl,
  });

  const inspectionEndDate = parse(parsed.data.inspectionEndDate, 'dd MMMM yyyy', new Date(), {
    locale: pl,
  });

  if (insuranceEndDate < new Date() || inspectionEndDate < new Date()) {
    return {
      success: false,
      errors: {
        insuranceEndDate: insuranceEndDate < new Date() ? ['Data końca ubezpieczenia nie może być z przeszłości'] : [],
        inspectionEndDate: inspectionEndDate < new Date() ? ['Data końca przeglądu nie może być z przeszłości'] : [],
      },
    };
  }

  await db.update(cars).set({
    make: parsed.data.make,
    model: parsed.data.model,
    registrationNumber: parsed.data.registrationNumber,
    insuranceEndDate: insuranceEndDate,
    inspectionEndDate: inspectionEndDate,
  }).where(eq(cars.id, parsed.data.id));

  return {
    success: true,
    errors: {},
    data: {},
  };
}
