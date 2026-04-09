// Legacy: client/src/components/DataBox/DEGTable.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getDEG } from "@/services/api";

const PAGE_SIZES = [15, 25, 50, 100, 200];

const COLUMNS = [
  { key: "SYMBOL", label: "SYMBOL", search: "search_symbol" },
  { key: "FC", label: "FC", search: "search_fc", fmt: "num3" },
  { key: "P.Value", label: "P.Value", search: "search_p_value", fmt: "exp" },
  { key: "adj.P.Val", label: "adj.P.Val", search: "search_adj_p_value", fmt: "exp" },
  { key: "AveExpr", label: "AveExpr", search: "search_aveexpr", fmt: "num3" },
  { key: "ACCNUM", label: "ACCNUM", search: "search_accnum" },
  { key: "DESC", label: "DESC", search: "search_desc" },
  { key: "ENTREZ", label: "ENTREZ", search: "search_entrez", link: true },
  { key: "probsetID", label: "probsetID", search: "search_probsetid" },
  { key: "t", label: "t", search: "search_t", fmt: "num3" },
  { key: "B", label: "B", search: "search_b", fmt: "num3" },
];

function formatCell(value: unknown, fmt?: string, link?: boolean): React.ReactNode {
  if (value == null || value === "") return "";
  if (link) {
    return <a href={`https://www.ncbi.nlm.nih.gov/gene/${value}`} target="_blank" rel="noopener noreferrer">{String(value)}</a>;
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

export default function DEGTable() {
  const store = useAnalysisStore();
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageNumber, setPageNumber] = useState(1);
  const [sorting, setSorting] = useState<{ name: string; order: string }>({ name: "P.Value", order: "ascend" });
  const [search, setSearch] = useState<Record<string, string>>({
    search_symbol: "",
    search_fc: "1.5",
    search_p_value: "0.05",
    search_adj_p_value: "",
    search_aveexpr: "",
    search_accnum: "",
    search_desc: "",
    search_entrez: "",
    search_probsetid: "",
    search_t: "",
    search_b: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (page: number, size: number, sort: { name: string; order: string }, searchKw: Record<string, string>) => {
    setLoading(true);
    setError("");
    try {
      const result = await getDEG({
        projectId: store.projectId,
        page_size: size,
        page_number: page,
        sorting: sort,
        search_keyword: searchKw,
      });
      setRecords(result.records);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load DEG data");
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

  const totalPages = Math.ceil(totalCount / pageSize);
  const startRow = (pageNumber - 1) * pageSize + 1;
  const endRow = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div>
      {error && <p style={{ color: "#b22222", fontSize: "0.85rem" }}>{error}</p>}

      {/* Controls row */}
      <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: "0.8rem" }}>
        <div>
          Show{" "}
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPageNumber(1); }} className="form-select form-select-sm d-inline-block" style={{ width: "auto" }}>
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>{" "}
          entries
        </div>
        <div className="text-muted">
          {totalCount > 0 ? `Showing ${startRow}-${endRow} of ${totalCount} records` : "No records"}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table className="table table-sm table-hover table-bordered mb-0" style={{ fontSize: "0.8rem" }}>
          <thead>
            {/* Search row */}
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
            {/* Header row */}
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
                    <td key={col.key} style={{ maxWidth: col.key === "DESC" ? "200px" : undefined, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {formatCell(row[col.key], col.fmt, col.link)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-2">
          <ul className="pagination pagination-sm mb-0">
            <li className={`page-item ${pageNumber <= 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPageNumber((p) => Math.max(1, p - 1))}>‹</button>
            </li>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page: number;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (pageNumber <= 4) {
                page = i + 1;
              } else if (pageNumber >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = pageNumber - 3 + i;
              }
              return (
                <li key={page} className={`page-item ${page === pageNumber ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPageNumber(page)}>{page}</button>
                </li>
              );
            })}
            <li className={`page-item ${pageNumber >= totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}>›</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
