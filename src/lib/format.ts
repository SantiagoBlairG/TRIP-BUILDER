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
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return formatter.formatRange(
    new Date(`${startDate}T00:00:00Z`),
    new Date(`${endDate}T00:00:00Z`),
  );
}
