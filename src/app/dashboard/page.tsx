import { auth } from "@clerk/nextjs/server";
import { format, parseISO } from "date-fns";
import { DatePicker } from "./DatePicker";
import { getWorkoutsForUserOnDate } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const { date: dateParam } = await searchParams;
  const dateStr = typeof dateParam === "string" ? dateParam : null;
  const date = dateStr ? parseISO(dateStr) : new Date();

  const workouts = await getWorkoutsForUserOnDate(userId, date);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            View your logged workouts by date.
          </p>
        </div>

        <DatePicker date={date} />

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>

          {workouts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No workouts logged for this date.
            </p>
          ) : (
            <ul className="space-y-4">
              {workouts.map((workout) => (
                <li key={workout.id} className="border rounded-lg p-4 space-y-3">
                  <p className="font-semibold">
                    {workout.name ?? format(workout.startedAt, "p")}
                  </p>
                  {workout.exercises.length > 0 && (
                    <ul className="space-y-2">
                      {workout.exercises.map((exercise) => (
                        <li key={exercise.id}>
                          <p className="font-medium text-sm">{exercise.name}</p>
                          {exercise.sets.length > 0 && (
                            <ul className="mt-1 space-y-1">
                              {exercise.sets.map((set) => (
                                <li
                                  key={set.id}
                                  className="text-sm text-muted-foreground flex gap-4"
                                >
                                  <span>Set {set.setNumber}</span>
                                  {set.weight && <span>{set.weight} kg</span>}
                                  {set.reps && <span>{set.reps} reps</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
