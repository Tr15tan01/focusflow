"use server";

import { prisma } from "@/lib/prisma";
import { createTaskSchemaType } from "@/schema/createTask";
import { currentUser } from "@clerk/nextjs/server";

export async function createTask(data: createTaskSchemaType) {
  const user = await currentUser();
  if (!user) {
    throw new Error("no user found");
  }

  const { content, expiresAt, collectionId } = data;

  return await prisma.task.create({
    data: {
      userId: user.id,
      content,
      expiresAt,
      Collection: {
        connect: {
          id: collectionId,
        },
      },
    },
  });
}

// export async function setTaskDone(id: number) {
//   const user = currentUser();
//   if (!user) {
//     throw new Error("no user");
//   }

//   return await prisma.task.update({
//     where: {
//       id: id,
//       userId: user.id,
//     },
//     data: { done: true },
//   });
// }

export async function setTaskDone(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("no user");
  }

  // Fetch current task status
  const task = await prisma.task.findUnique({
    where: {
      id: id,
      userId: user.id,
    },
    select: { done: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // Toggle the 'done' status
  return await prisma.task.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: { done: !task.done },
  });
}
