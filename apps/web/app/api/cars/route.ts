import { cars, db, organizations, users } from '@repo/db';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { and, eq, gte, lte, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const now = new Date();

    const sevenDaysFromNowStart = startOfDay(addDays(now, 7));
    const sevenDaysFromNowEnd = endOfDay(addDays(now, 7));

    const fourteenDaysFromNowStart = startOfDay(addDays(now, 14));
    const fourteenDaysFromNowEnd = endOfDay(addDays(now, 14));

    const carsToNotify = await db
      .select({
        id: cars.id,
        model: cars.model,
        make: cars.make,
        registrationNumber: cars.registrationNumber,
        insuranceEndDate: cars.insuranceEndDate,
        inspectionEndDate: cars.inspectionEndDate,
        createdBy: users.email,
        organizationEmail: organizations.organizationEmail,
      })
      .from(cars)
      .leftJoin(users, eq(cars.createdBy, users.id))
      .leftJoin(organizations, eq(cars.organizationId, organizations.id))
      .where(
        or(
          and(gte(cars.insuranceEndDate, sevenDaysFromNowStart), lte(cars.insuranceEndDate, sevenDaysFromNowEnd)),
          and(gte(cars.inspectionEndDate, sevenDaysFromNowStart), lte(cars.inspectionEndDate, sevenDaysFromNowEnd)),
          and(gte(cars.insuranceEndDate, fourteenDaysFromNowStart), lte(cars.insuranceEndDate, fourteenDaysFromNowEnd)),
          and(gte(cars.inspectionEndDate, fourteenDaysFromNowStart), lte(cars.inspectionEndDate, fourteenDaysFromNowEnd))
        )
      );

    if (carsToNotify.length === 0) {
      return NextResponse.json({ message: 'No cars to notify' }, { status: 200 });
    }

    const notificationsByOrg = new Map<
      string,
      {
        notificationEmail: string;
        items: {
          make: string;
          model: string;
          registrationNumber: string;
          notificationType: 'Insurance' | 'Technical Inspection';
          dueDate: Date;
          daysUntil: 7 | 14;
        }[];
      }
    >();

    return new Response(
      JSON.stringify({
        sevenDaysFromNowStart,
        sevenDaysFromNowEnd,
        fourteenDaysFromNowStart,
        fourteenDaysFromNowEnd,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response('Failed to get cars', { status: 400 });
  }
}
