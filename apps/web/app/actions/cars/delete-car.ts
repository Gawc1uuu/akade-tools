'use server'
import { cars, db } from '@repo/db';
import { eq } from 'drizzle-orm';
import { getToken, verifyToken } from '~/lib/tokens';

interface DeleteCarFormState {
    success: boolean;
    deletedCar?: any | null;
}

export const deleteCar = async (prevState: DeleteCarFormState,formData: FormData): Promise<DeleteCarFormState> => {
    const id = formData.get('id') as string;
    const token = await getToken();
    if (!token) {
        return { success: false, deletedCar: null };
    }
    const payload = await verifyToken(token);

    if (!payload) {
        return { success: false, deletedCar: null };
    }

    const [deletedCar] = await db.delete(cars).where(eq(cars.id, id)).returning();
    if (!deletedCar) {
        return { success: false, deletedCar: null };
    }
    return { success: true, deletedCar };
};