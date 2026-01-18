export function getDuration(period: string) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const parts = period.split(' - ');
  if (parts.length !== 2) return '';

  const parseDate = (str: string) => {
    if (str.toUpperCase() === 'PRESENT') return new Date();
    const [monthStr, yearStr] = str.split(' ');
    const monthIndex = months.findIndex(m => m.startsWith(monthStr));
    return new Date(parseInt(yearStr), monthIndex !== -1 ? monthIndex : 0);
  };

  const start = parseDate(parts[0]);
  const end = parseDate(parts[1]);

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
