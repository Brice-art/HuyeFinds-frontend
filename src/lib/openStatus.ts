import type { BusinessHour } from "@/types";

const DAY_KEYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export interface OpenStatus {
  isOpen: boolean;
  label: string;
}

export function getOpenStatus(
  hours: BusinessHour[],
  now: Date = new Date(),
): OpenStatus | null {
  if (hours.length === 0) return null;

  const todayKey = DAY_KEYS[now.getDay()];
  const today = hours.find((h) => h.dayOfWeek === todayKey);
  if (!today || today.isClosed || !today.openTime || !today.closeTime) {
    return { isOpen: false, label: "Closed today" };
  }

  const [openH, openM] = today.openTime.split(":").map(Number);
  const [closeH, closeM] = today.closeTime.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const isOpen = nowMinutes >= openMinutes && nowMinutes < closeMinutes;

  return {
    isOpen,
    label: isOpen
      ? `Open now · Closes ${today.closeTime}`
      : `Closed · Opens ${today.openTime}`,
  };
}
