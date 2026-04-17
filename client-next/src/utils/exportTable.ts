import writeXlsxFile from "write-excel-file/browser";

interface Column {
  key: string;
  label: string;
}

interface StoreInfo {
  analysisType: string;
  accessionCode: string;
  fileList: File[];
  group1: string;
  group2: string;
}

export function buildSettingsRows(store: StoreInfo): (string | null)[][] {
  const rows: (string | null)[][] = [
    ["Analysis Type", store.analysisType === "0" ? "GEO Data" : "CEL Files"],
  ];
  if (store.analysisType === "0") {
    rows.push(["Accession Code", store.accessionCode]);
  } else {
    rows.push(["Upload Data", store.fileList.map((f) => f.name).join(", ")]);
  }
  rows.push(["Contrast", `${store.group1} vs ${store.group2}`]);
  return rows;
}

export async function exportTableToXlsx(
  settingsRows: (string | null)[][],
  columns: Column[],
  records: Record<string, unknown>[],
  fileName: string
): Promise<void> {
  const resultsData: (string | number | null)[][] = [
    columns.map((c) => c.label),
    ...records.map((row) =>
      columns.map((c) => {
        const val = row[c.key];
        if (val == null) return null;
        if (typeof val === "number") return val;
        return String(val);
      })
    ),
  ];

  await writeXlsxFile([settingsRows, resultsData], {
    sheets: ["Settings", "Results"],
    fileName,
  });
}

export async function exportNormalizedXlsx(
  records: Record<string, unknown>[],
  fileName: string
): Promise<void> {
  if (!records.length) return;
  const cols = Object.keys(records[0]).map((c) => c.replace(/\n+/g, ""));
  const data: (string | number | null)[][] = [
    cols,
    ...records.map((row) =>
      Object.values(row).map((v) => {
        if (v == null) return null;
        if (typeof v === "number") return v;
        return String(v);
      })
    ),
  ];
  await writeXlsxFile([data], { sheets: ["Data"], fileName });
}

export function exportNormalizedTsv(
  records: Record<string, unknown>[],
  fileName: string
): void {
  if (!records.length) return;
  const cols = Object.keys(records[0]).map((c) => c.replace(/\n+/g, ""));
  const lines = [
    cols.join("\t"),
    ...records.map((row) => Object.values(row).map((v) => (v == null ? "" : String(v))).join("\t")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/tab-separated-values" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
