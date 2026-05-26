"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkoutForUser } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().optional(),
  startedAt: z.coerce.date(),
});

type CreateWorkoutParams = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkout(params: CreateWorkoutParams) {
  const { name, startedAt } = CreateWorkoutSchema.parse(params);

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  await createWorkoutForUser(userId, { name: name || undefined, startedAt });
}
