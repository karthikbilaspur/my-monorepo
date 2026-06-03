export function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat("en-IN").format(
    date
  );
}