export const parseDate = (dateSource) => {
  if (!dateSource) return null;
  if (dateSource instanceof Date) {
    return isNaN(dateSource.getTime()) ? null : dateSource;
  }

  const dateString = String(dateSource).split("T")[0];

  let year, month, day;

  if (dateString.includes("-")) {
    [year, month, day] = dateString.split("-").map(Number);
  } else if (dateString.includes("/")) {
    [day, month, year] = dateString.split("/").map(Number);
  } else {
    const d = new Date(dateSource);
    return isNaN(d.getTime()) ? null : d;
  }

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (dateSource) => {
  if (!dateSource) return '-';

  const date = parseDate(dateSource);
  if (!date) return String(dateSource);

  return dateFormatter.format(date);
};