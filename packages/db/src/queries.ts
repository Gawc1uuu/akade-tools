// In packages/db/src/queries.ts

import { eq } from 'drizzle-orm';
import { db, users } from './index';

export async function getUserById(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return user;
}

export async function getUserByEmail(email:string){
  const user = await db.query.users.findFirst({
    where:eq(users.email,email)
  })
  return user;
}
