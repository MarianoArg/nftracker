import type { User, Collection, Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { getUserByAddress } from "./user.server";

export type { Collection } from "@prisma/client";

export async function getCollection({
  id,
  userAddress,
}: Pick<Collection, "id"> & {
  userAddress: User["address"];
}) {
  const user = await getUserByAddress(userAddress);

  return prisma.collection.findFirst({
    select: { id: true, tokens: true, title: true, isDraft: true, setId: true },
    where: { id, userId: user?.id },
  });
}

export async function getCollectionListItems({
  userAddress,
}: {
  userAddress: User["address"];
}) {
  const user = await getUserByAddress(userAddress);

  return prisma.collection.findMany({
    where: { userId: user?.id },
    select: { id: true, tokens: true, title: true, isDraft: true, setId: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createCollection({
  userAddress,
  setId,
  tokens,
  isDraft,
  title,
}: Pick<Collection, "title" | "setId" | "isDraft" | "tokens"> & {
  userAddress: User["address"];
}) {
  const user = await getUserByAddress(userAddress);
  return prisma.collection.create({
    data: {
      title,
      tokens: tokens as Prisma.JsonObject,
      setId,
      isDraft,
      user: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
}

export async function updateCollection({
  setId,
  tokens,
  isDraft,
  title,
  id,
}: Pick<Collection, "title" | "setId" | "isDraft" | "tokens" | "id">) {
  return prisma.collection.update({
    where: {
      id,
    },
    data: {
      title,
      tokens: tokens as Prisma.JsonObject,
      setId,
      isDraft,
    },
  });
}

export async function deleteCollection({
  id,
  userAddress,
}: Pick<Collection, "id"> & { userAddress: User["address"] }) {
  const user = await getUserByAddress(userAddress);
  return prisma.collection.deleteMany({
    where: { id, userId: user?.id },
  });
}
