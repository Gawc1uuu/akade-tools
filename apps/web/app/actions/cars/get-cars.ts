import { db,cars } from "@repo/db";
import { eq } from "drizzle-orm";
import { getToken, verifyToken } from "~/lib/tokens";

export async function getCars() {
    const token = await getToken();
    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
        throw new Error("Unauthenticated")
    }

    if (!decodedToken.organizationId) {
        throw new Error("Organization ID not found")
    }
    const organizationCars = await db.query.cars.findMany({
        where: eq(cars.organizationId, String(decodedToken.organizationId)),
    });

    return organizationCars;        
}