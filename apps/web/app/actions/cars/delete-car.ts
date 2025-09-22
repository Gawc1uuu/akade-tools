'use server';
import { cars, db } from '@repo/db';
import { eq } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';

interface DeleteCarFormState {
  success: boolean;
  deletedCar?: any | null;
  message?: string;
}

export const deleteCar = async (prevState: DeleteCarFormState, formData: FormData): Promise<DeleteCarFormState> => {
  const id = formData.get('id') as string;
  const token = await getToken();
  if (!token) {
    return { success: false, message: 'Brak autoryzacji.' };
  }
  const payload = await verifyToken(token);

  if (!payload) {
    return { success: false, message: 'Brak autoryzacji.' };
  }

  try {
    const [deletedCar] = await db.delete(cars).where(eq(cars.id, id)).returning();
    if (!deletedCar) {
      return { success: false, message: 'Nie udało się usunąć pojazdu.' };
    }
    return { success: true, deletedCar, message: 'Pojazd został pomyślnie usunięty.' };
  } catch (error) {
    return { success: false, message: 'Wystąpił błąd serwera.' };
  }
};
