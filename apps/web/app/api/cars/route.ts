import { cars, db, organizations, users } from '@repo/db';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import { and, eq, gte, lte, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import NotificationEmail from '~/emails/notification-email';
import { EmailSender } from '~/singletons/EmailSender';

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
        organizationId: organizations.id,
        organizationEmail: organizations.organizationEmail,
        organizationName: organizations.name,
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
        organizationName: string;
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

    for (const car of carsToNotify) {
      if (!car.organizationId || !car.organizationEmail || !car.organizationName) {
        continue;
      }

      if (!notificationsByOrg.has(car.organizationId)) {
        notificationsByOrg.set(car.organizationId, {
          notificationEmail: car.organizationEmail,
          organizationName: car.organizationName,
          items: [],
        });
      }

      const orgNotification = notificationsByOrg.get(car.organizationId)!;

      if (car.insuranceEndDate) {
        const insuranceDate = new Date(car.insuranceEndDate);
        if (insuranceDate >= sevenDaysFromNowStart && insuranceDate <= sevenDaysFromNowEnd) {
          orgNotification.items.push({
            make: car.make,
            model: car.model,
            registrationNumber: car.registrationNumber,
            notificationType: 'Insurance',
            dueDate: insuranceDate,
            daysUntil: 7,
          });
        } else if (insuranceDate >= fourteenDaysFromNowStart && insuranceDate <= fourteenDaysFromNowEnd) {
          orgNotification.items.push({
            make: car.make,
            model: car.model,
            registrationNumber: car.registrationNumber,
            notificationType: 'Insurance',
            dueDate: insuranceDate,
            daysUntil: 14,
          });
        }
      }

      if (car.inspectionEndDate) {
        const inspectionDate = new Date(car.inspectionEndDate);
        if (inspectionDate >= sevenDaysFromNowStart && inspectionDate <= sevenDaysFromNowEnd) {
          orgNotification.items.push({
            make: car.make,
            model: car.model,
            registrationNumber: car.registrationNumber,
            notificationType: 'Technical Inspection',
            dueDate: inspectionDate,
            daysUntil: 7,
          });
        } else if (inspectionDate >= fourteenDaysFromNowStart && inspectionDate <= fourteenDaysFromNowEnd) {
          orgNotification.items.push({
            make: car.make,
            model: car.model,
            registrationNumber: car.registrationNumber,
            notificationType: 'Technical Inspection',
            dueDate: inspectionDate,
            daysUntil: 14,
          });
        }
      }
    }

    const emailSender = EmailSender.getInstance();

    for (const [orgId, notification] of notificationsByOrg.entries()) {
      if (notification.items.length > 0) {
        await emailSender.sendEmail({
          to: [notification.notificationEmail],
          subject: 'Vehicle Document Expiration Reminder',
          react: NotificationEmail({
            organizationName: notification.organizationName,
            items: notification.items,
          }),
        });
      }
    }

    return NextResponse.json({ message: 'Notifications sent' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get cars' }, { status: 400 });
  }
}
