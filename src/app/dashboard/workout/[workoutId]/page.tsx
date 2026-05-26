import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getWorkoutByIdForUser } from "@/data/workouts";
import EditWorkoutForm from "./EditWorkoutForm";

interface Props {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);
  if (isNaN(id)) notFound();

  const { userId } = await auth();
  if (!userId) return null;

  const workout = await getWorkoutByIdForUser(userId, id);
  if (!workout) notFound();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Workout</h1>
          <p className="text-muted-foreground mt-1">Update your workout details.</p>
        </div>

        <EditWorkoutForm
          workoutId={workout.id}
          initialName={workout.name}
          initialStartedAt={workout.startedAt}
        />
      </div>
    </div>
  );
}
