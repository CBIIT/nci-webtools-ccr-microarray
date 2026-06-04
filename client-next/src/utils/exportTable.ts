import writeXlsxFile from "write-excel-file/browser";
import type { Sample } from "@/services/api";

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
  dataList: Sample[];
}

export function buildSettingsRows(
  store: StoreInfo,
  opts?: { type?: string; filters?: [string, string, boolean?][] }
): (string | null)[][] {
  const rows: (string | null)[][] = [
    ["Analysis Type", store.analysisType === "GEO" ? "GEO Data" : "CEL Files"],
  ];
  if (store.analysisType === "GEO") {
    rows.push(["Accession Code", store.accessionCode]);
  } else {
    rows.push(["Upload Data", store.fileList.map((f) => f.name).join(", ")]);
  }
  rows.push(["Contrasts", `${store.group1} vs ${store.group2}`]);
  const g1gsms = store.dataList.filter((s) => s.groups === store.group1).map((s) => s.gsm).join(",") + ",";
  const g2gsms = store.dataList.filter((s) => s.groups === store.group2).map((s) => s.gsm).join(",") + ",";
  rows.push([store.group1, g1gsms]);
  rows.push([store.group2, g2gsms]);
  if (opts?.type) rows.push(["Type", opts.type]);
  if (opts?.filters?.length) {
    rows.push(["Filters", ""]);
    for (const [label, value, force] of opts.filters) {
      if (value || force) rows.push([label, value]);
    }
  }
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
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/tab-separated-values" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
