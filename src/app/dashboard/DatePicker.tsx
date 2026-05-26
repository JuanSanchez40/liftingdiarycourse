"use client";

import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ date }: { date: Date }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    const params = new URLSearchParams();
    params.set("date", format(d, "yyyy-MM-dd"));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Date</label>
      <Popover>
        <PopoverTrigger className="group/button inline-flex w-full items-center justify-start gap-2 rounded-lg border bg-clip-padding px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <CalendarIcon className="size-4" />
          {format(date, "do MMM yyyy")}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
