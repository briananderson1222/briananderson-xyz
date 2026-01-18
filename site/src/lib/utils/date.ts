export function getDuration(startDate: string, endDate?: string): string {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const parseDate = (str: string) => {
    if (str.toUpperCase() === 'PRESENT') return new Date();
    const [monthStr, yearStr] = str.split(' ');
    const monthIndex = months.findIndex(m => m.startsWith(monthStr));
    return new Date(parseInt(yearStr), monthIndex !== -1 ? monthIndex : 0);
  };

  const start = parseDate(startDate);
  const end = endDate ? parseDate(endDate) : new Date();

  let years = end.getFullYear() - start.getFullYear();
  let m = end.getMonth() - start.getMonth();

  if (m < 0) {
    years--;
    m += 12;
  }
  m++;
  if (m === 12) {
    years++;
    m = 0;
  }

  const yStr = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
  const mStr = m > 0 ? `${m} mo${m > 1 ? 's' : ''}` : '';

  return [yStr, mStr].filter(Boolean).join(' ');
}

