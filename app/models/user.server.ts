import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserByAddress(address: User["address"]) {
  return prisma.user.findUnique({ where: { address } });
}

export async function getOrcreateUser(address: User["address"]) {
  return prisma.user.upsert({
    where: {
      address: address,
    },
    update: {},
    create: {
      address,
    },
  });
}

export async function deleteUserByAddress(address: User["address"]) {
  return prisma.user.delete({ where: { address } });
}
