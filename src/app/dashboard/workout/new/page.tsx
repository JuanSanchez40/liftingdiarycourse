"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createWorkout } from "./actions";

export default function NewWorkoutPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    await createWorkout({ name: name || undefined, startedAt: date });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Workout</h1>
          <p className="text-muted-foreground mt-1">Log a new workout session.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              placeholder="e.g. Push Day"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger
                className={cn(
                  "flex h-9 w-full items-center justify-start gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "do MMM yyyy") : "Pick a date"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Create Workout"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
