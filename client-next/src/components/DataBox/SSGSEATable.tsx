// Legacy: client/src/components/DataBox/SSGSEATable.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getGSEA } from "@/services/api";
import TableControls from "./TableControls";
import formatCell from "./formatCell";
import CellTooltip from "./CellTooltip";
import { buildSettingsRows, exportTableToXlsx } from "@/utils/exportTable";

const COLUMNS = [
  { key: "V1", label: "NAME", search: "name", wide: true },
  { key: "V2", label: "logFC", search: "search_logFC", fmt: "num3" },
  { key: "V5", label: "P.Value", search: "search_p_value", fmt: "exp" },
  { key: "V6", label: "adj.P.Value", search: "search_adj_p_value", fmt: "exp" },
  { key: "V3", label: "Avg.Enrichment.Score", search: "search_Avg_Enrichment_Score" },
  { key: "V4", label: "t", search: "search_t", fmt: "num3" },
  { key: "V7", label: "b", search: "search_b", fmt: "num3" },
];

export default function SSGSEATable() {
  const store = useAnalysisStore();
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageNumber, setPageNumber] = useState(1);
  const [sorting, setSorting] = useState<{ name: string; order: string }>({ name: "P.Value", order: "ascend" });
  const [search, setSearch] = useState<Record<string, string>>({
    name: "",
    search_logFC: "",
    search_p_value: "",
    search_adj_p_value: "",
    search_Avg_Enrichment_Score: "",
    search_t: "",
    search_b: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (page: number, size: number, sort: { name: string; order: string }, searchKw: Record<string, string>) => {
    setLoading(true);
    setError("");
    try {
      const result = await getGSEA({
        projectId: store.projectId,
        page_size: size,
        page_number: page,
        sorting: sort,
        search_keyword: searchKw,
      });
      setRecords(result.records);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ssGSEA data");
    } finally {
      setLoading(false);
    }
  }, [store.projectId]);

  useEffect(() => {
    fetchData(pageNumber, pageSize, sorting, search);
  }, [pageNumber, pageSize, sorting, search, fetchData]);

  function handleSort(colKey: string) {
    setSorting((prev) => ({
      name: colKey,
      order: prev.name === colKey && prev.order === "ascend" ? "descend" : "ascend",
    }));
    setPageNumber(1);
  }

  function handleSearch(field: string, value: string) {
    setSearch((prev) => ({ ...prev, [field]: value }));
    setPageNumber(1);
  }

  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const result = await getGSEA({
        projectId: store.projectId,
        page_size: 100000,
        page_number: 1,
        sorting,
        search_keyword: search,
      });
      await exportTableToXlsx(
        buildSettingsRows(store),
        COLUMNS,
        result.records,
        `ssGSEA_${store.projectId}.xlsx`
      );
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const startRow = (pageNumber - 1) * pageSize + 1;
  const endRow = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div>
      {error && <p style={{ color: "#b22222", fontSize: "0.85rem" }}>{error}</p>}

      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-sm btn-nci-primary px-3" onClick={handleExport} disabled={exporting}>
          {exporting ? "Exporting..." : "Export"}
        </button>
      </div>

      <TableControls
        pageSize={pageSize}
        onPageSizeChange={(s) => { setPageSize(s); setPageNumber(1); }}
        currentPage={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        startRow={startRow}
        endRow={endRow}
        onPageChange={setPageNumber}
      />

      <div style={{ overflowX: "auto" }}>
        <table className="table table-sm table-hover table-bordered mb-0" style={{ fontSize: "0.8rem" }}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={`search-${col.key}`} style={{ padding: "4px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ fontSize: "0.75rem" }}
                    placeholder="Search"
                    value={search[col.search] || ""}
                    onChange={(e) => handleSearch(col.search, e.target.value)}
                  />
                </th>
              ))}
            </tr>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  role="button"
                  onClick={() => handleSort(col.key)}
                  style={{ whiteSpace: "nowrap", cursor: "pointer", userSelect: "none", background: "#fafafa" }}
                >
                  {col.label}
                  {sorting.name === col.key && (
                    <span style={{ marginLeft: "4px" }}>{sorting.order === "ascend" ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={COLUMNS.length} className="text-center py-3 text-muted">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={COLUMNS.length} className="text-center py-3 text-muted">No Data</td></tr>
            ) : (
              records.map((row, i) => (
                <tr key={i}>
                  {COLUMNS.map((col) => (
                    <CellTooltip key={col.key} content={String(row[col.key] ?? "")} tdStyle={{ maxWidth: col.wide ? "250px" : undefined }}>
                      {formatCell(row[col.key], col.fmt)}
                    </CellTooltip>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
