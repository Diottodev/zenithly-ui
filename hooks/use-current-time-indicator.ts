"use client";

import { EndHour, StartHour } from "$/components/ui/constants";
import { endOfWeek, isSameDay, isWithinInterval, startOfWeek } from "date-fns";
import React from "react";

/**
 * Hook that calculates the position of the current time in a calendar view (24-hour format).
 *
 * Returns the percentage position of the current time in relation to the configured day range (StartHour/EndHour)
 * and whether the current time is visible in the view (day or week).
 *
 * @param currentDate Date currently displayed in the calendar (reference for the visibility calculation).
 * @param view Calendar view: "day" or "week".
 * @returns An object with:
 * - currentTimePosition: number (percentage position of the current time in the day range, 0 to 100)
 * - currentTimeVisible: boolean (whether the current time is visible in the view)
 *
 * @example
 * // For a calendar from 8 to 18h, at 14h:
 * // currentTimePosition = 60 (60% of the day has passed)
 * // currentTimeVisible = true if currentDate is today
 */
export function useCurrentTimeIndicator(
  currentDate: Date,
  view: "day" | "week"
): { currentTimePosition: number; currentTimeVisible: boolean } {
  const [currentTimePosition, setCurrentTimePosition] =
    React.useState<number>(0);
  const [currentTimeVisible, setCurrentTimeVisible] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    const calculateTimePosition = () => {
      const now = new Date();
      // 24h format: calculates minutes since StartHour
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = (hours - StartHour) * 60 + minutes;
      const dayStartMinutes = 0;
      const dayEndMinutes = (EndHour - StartHour) * 60;
      // Ensures that the position is between 0 and 100
      const clampedMinutes = Math.max(0, Math.min(totalMinutes, dayEndMinutes));
      const position =
        (clampedMinutes / (dayEndMinutes - dayStartMinutes)) * 100;
      // Check if current day is in view based on the calendar view
      let isCurrentTimeVisible = false;
      if (view === "day") {
        isCurrentTimeVisible = isSameDay(now, currentDate);
      } else if (view === "week") {
        const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 0 });
        const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 0 });
        isCurrentTimeVisible = isWithinInterval(now, {
          start: startOfWeekDate,
          end: endOfWeekDate,
        });
      }
      setCurrentTimePosition(position);
      setCurrentTimeVisible(isCurrentTimeVisible);
    };
    // Calculate immediately
    calculateTimePosition();
    // Update every minute
    const interval = setInterval(calculateTimePosition, 60000);
    return () => clearInterval(interval);
  }, [currentDate, view]);
  return { currentTimePosition, currentTimeVisible };
}
