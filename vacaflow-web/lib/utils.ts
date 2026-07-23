/**
 * Parse a date string as a LOCAL date.
 * Date-only strings ("2026-08-24") are otherwise parsed as UTC midnight by the
 * Date constructor, which shifts the displayed day backwards in timezones behind
 * UTC. Splitting the components keeps the calendar day the user intended.
 */
function parseLocalDate(dateString: string): Date {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  if (dateOnly) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateString);
}

export function formatDate(dateString: string): string {
  const date = parseLocalDate(dateString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return formatter.format(date);
}

export function getDayOfWeek(dateString: string): string {
  const date = parseLocalDate(dateString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  });
  return formatter.format(date);
}

export function calculateWorkingDays(startDateStr: string, endDateStr: string): number {
  const startDate = parseLocalDate(startDateStr);
  const endDate = parseLocalDate(endDateStr);

  let count = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} – ${end}`;
}

export function getRequestDisplayId(id: string): string {
  // Take last 4 characters of the ID for display
  return `RQ-${id.substring(id.length - 4).toUpperCase()}`;
}
