// Put this file at: src/utils/formatIssueDate.js

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// { month: 9, year: "2026" } -> "Sep 2026"
// month missing                -> "2026"
export function formatIssueDate(certificate) {
  const month = Number(certificate?.month);
  const year = certificate?.year;

  if (month >= 1 && month <= 12 && year) {
    return `${MONTH_LABELS[month - 1]} ${year}`;
  }

  return year || "";
}