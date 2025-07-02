import { CalendarProvider } from "$/components/ui/calendar-context";
import { Skeleton } from "$/components/ui/skeleton";
import dynamic from "next/dynamic";

const BigCalendar = dynamic(() => import("$/components/ui/big-calendar"), {
  loading: () => (
    <div className="flex flex-col gap-4 p-4 md:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="grid gap-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </div>
    </div>
  ),
});
export default function Agenda() {
  return (
    <div className="w-full">
      <CalendarProvider>
        <BigCalendar />
      </CalendarProvider>
    </div>
  );
}
