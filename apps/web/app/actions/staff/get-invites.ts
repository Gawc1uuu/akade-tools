"use server";

import { db, invites } from "@repo/db";
import { count, eq } from "drizzle-orm";
import { getToken, verifyToken } from "~/lib/tokens";
import { Invite } from "~/lib/types";

export async function getOrganizationInvites({
  page,
  limit,
  offset,
}: {
  page: number;
  limit: number;
  offset: number;
}) {
  const token = await getToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  const decodedToken = await verifyToken(token);

  if (!decodedToken || !decodedToken.organizationId) {
    throw new Error("Unauthorized");
  }

  const { data, total } = await db.transaction(async tx => {
    const data = await tx.query.invites.findMany({
      limit,
      offset,
      orderBy: (invites, { desc }) => [desc(invites.createdAt)],
    });

    const [total] = await tx.select({ count: count() }).from(invites).where(eq(invites.organizationId, decodedToken.organizationId as string));

    return { data, total: total?.count ?? 0 };
  });

  return {
    data: data as Invite[],
    total,
    totalPages: total === 0 ? 1 : Math.ceil(total / limit),
    currentPage: page,
  };

}