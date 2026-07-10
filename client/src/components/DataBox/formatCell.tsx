export default function formatCell(value: unknown, fmt?: string, link?: boolean): React.ReactNode {
  if (value == null || value === "") return "";
  if (link && value !== "NA") {
    return (
      <a href={`https://www.ncbi.nlm.nih.gov/gene/${value}`} target="_blank" rel="noopener noreferrer">
        {String(value)}
      </a>
    );
  }
  if (fmt === "exp") {
    const n = Number(value);
    return isNaN(n) ? String(value) : n === 0 ? "0" : n.toExponential(3);
  }
  if (fmt === "num3") {
    const n = Number(value);
    return isNaN(n) ? String(value) : n.toFixed(3);
  }
  return String(value);
}
