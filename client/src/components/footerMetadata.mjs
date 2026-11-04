const UNKNOWN_DATE = "Unknown";

function normalizeDate(dateString) {
  if (!dateString) return undefined;

  const isoDateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const compactDateMatch = dateString.match(/^(\d{4})(\d{2})(\d{2})$/);
  const match = isoDateMatch ?? compactDateMatch;

  if (!match) return undefined;

  const [, year, month, day] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() + 1 !== Number(month) ||
    date.getUTCDate() !== Number(day)
  ) {
    return undefined;
  }

  return `${year}-${month}-${day}`;
}

export function parseFooterMetadata(versionString, deploymentDate) {
  const versionMatch = versionString?.match(/(\d+\.\d+\.\d+)(_dev)?/);
  const version =
    !versionString || versionString === "local"
      ? "dev"
      : versionMatch
        ? versionMatch[1] + (versionMatch[2] || "")
        : versionString;

  const versionDate = versionString?.match(/(\d{8})/)?.[1];
  const date =
    normalizeDate(deploymentDate) ??
    normalizeDate(versionDate) ??
    UNKNOWN_DATE;

  return { version, date };
}
