/**
 * Calculates the time remaining until the specified end date.
 *
 * @param {string | Date} endsAt - The end date as a string or Date object.
 * @returns {string} A formatted string representing the time remaining,
 *                   e.g., "2 day(s)", "5 hour(s)", "30 min(s)", or "Ended" if the time has passed.
 */
export function getTimeRemaining(endsAt) {
  const endDate = new Date(endsAt);
  const now = new Date();
  const diffMs = endDate - now;

  if (diffMs <= 0) return "Ended";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} day(s)`;
  if (hours > 0) return `${hours} hour(s)`;
  return `${minutes} min(s)`;
}
