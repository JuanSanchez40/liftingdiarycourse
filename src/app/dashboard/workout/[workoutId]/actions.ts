"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkoutForUser } from "@/data/workouts";

const UpdateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().optional(),
  startedAt: z.coerce.date(),
});

type UpdateWorkoutParams = z.infer<typeof UpdateWorkoutSchema>;

export async function updateWorkout(params: UpdateWorkoutParams) {
  const { workoutId, name, startedAt } = UpdateWorkoutSchema.parse(params);

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  await updateWorkoutForUser(userId, workoutId, { name: name || undefined, startedAt });
}
