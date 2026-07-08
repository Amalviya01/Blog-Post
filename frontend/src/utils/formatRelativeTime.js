const UNITS = [
  { limit: 60, divisor: 1, unit: "Minute" },
  { limit: 60 * 24, divisor: 60, unit: "Hour" },
  { limit: 60 * 24 * 30, divisor: 60 * 24, unit: "Day" },
  { limit: 60 * 24 * 365, divisor: 60 * 24 * 30, unit: "Month" },
];

export function formatRelativeTime(isoString) {
  const diffMinutes = Math.max(1, Math.round((Date.now() - new Date(isoString).getTime()) / 60000));

  for (const { limit, divisor, unit } of UNITS) {
    if (diffMinutes < limit) {
      const value = Math.max(1, Math.round(diffMinutes / divisor));
      return `${value} ${unit}${value > 1 ? "s" : ""} Ago`;
    }
  }

  const years = Math.round(diffMinutes / (60 * 24 * 365));
  return `${years} Year${years > 1 ? "s" : ""} Ago`;
}
