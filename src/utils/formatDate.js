export const parseLocalDate = (dateString) => {
  if (!dateString) return new Date();

  if (typeof dateString === 'string') {
    if (dateString.includes('-')) {
      const clean = dateString.split('T')[0];
      const [year, month, day] = clean.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    }
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    }
  }

  return new Date(dateString);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';

  const date = parseLocalDate(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};