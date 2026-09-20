const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
export function formatMoney(amount: number): string {
  return usd.format(amount);
}
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return (
    [hours ? `${hours}h` : "", remainder ? `${remainder}m` : ""]
      .filter(Boolean)
      .join(" ") || "0m"
  );
}
export function formatTripDates(startDate?: string, endDate?: string): string {
  if (!startDate || !endDate) return "Dates to dream about";
  // Validated calendar dates, not instants. Fixed punctuation avoids Node/browser
  // ICU formatRange differences during hydration.
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  const start = `${months[startMonth - 1]} ${startDay}`;
  const end = `${months[endMonth - 1]} ${endDay}`;
  if (startDate === endDate) return `${start}, ${startYear}`;
  if (startYear !== endYear)
    return `${start}, ${startYear} – ${end}, ${endYear}`;
  if (startMonth !== endMonth) return `${start} – ${end}, ${startYear}`;
  return `${start}–${endDay}, ${startYear}`;
}
