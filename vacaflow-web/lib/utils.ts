export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return formatter.format(date);
}

export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  });
  return formatter.format(date);
}

export function calculateWorkingDays(startDateStr: string, endDateStr: string): number {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

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
