// Legacy: client/src/components/DataBox/DEGTable.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getDEG, getNormalAll } from "@/services/api";
import TableControls from "./TableControls";
import formatCell from "./formatCell";
import CellTooltip from "./CellTooltip";
import { buildSettingsRows, exportTableToXlsx, exportNormalizedXlsx, exportNormalizedTsv } from "@/utils/exportTable";

const EXPORT_COLUMNS = [
  { key: "SYMBOL", label: "SYMBOL" },
  { key: "FC", label: "FC" },
  { key: "logFC", label: "logFC" },
  { key: "P.Value", label: "P.Value" },
  { key: "adj.P.Val", label: "adj.P.Val" },
  { key: "AveExpr", label: "AveExpr" },
  { key: "ACCNUM", label: "ACCNUM" },
  { key: "DESC", label: "DESC" },
  { key: "ENTREZ", label: "ENTREZ" },
  { key: "probsetID", label: "probsetID" },
  { key: "t", label: "t" },
  { key: "B", label: "B" },
];

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

  const [exporting, setExporting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function handleExportDEG() {
    setExporting(true);
    setDropdownOpen(false);
    try {
      const result = await getDEG({
        projectId: store.projectId,
        page_size: 100000,
        page_number: 1,
        sorting,
        search_keyword: search,
      });
      await exportTableToXlsx(
        buildSettingsRows(store),
        EXPORT_COLUMNS,
        result.records,
        `DEG_${store.projectId}.xlsx`
      );
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  async function handleExportNormalXlsx() {
    setExporting(true);
    setDropdownOpen(false);
    try {
      const data = await getNormalAll(store.projectId);
      await exportNormalizedXlsx(data, `DEG_Normalized_Data_for_All_Samples${store.projectId}.xlsx`);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }

  function handleExportNormalTsv() {
    setExporting(true);
    setDropdownOpen(false);
    getNormalAll(store.projectId)
      .then((data) => exportNormalizedTsv(data, `DEG_Normalized_Data_for_All_Samples${store.projectId}.tsv`))
      .catch((err) => console.error("Export failed:", err))
      .finally(() => setExporting(false));
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const startRow = (pageNumber - 1) * pageSize + 1;
  const endRow = Math.min(pageNumber * pageSize, totalCount);

  return (
    <div>
      {error && <p style={{ color: "#b22222", fontSize: "0.85rem" }}>{error}</p>}

      <TableControls
        pageSize={pageSize}
        onPageSizeChange={(s) => { setPageSize(s); setPageNumber(1); }}
        currentPage={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        startRow={startRow}
        endRow={endRow}
        onPageChange={setPageNumber}
      >
        <div className="dropdown">
          <button
            className="btn btn-sm btn-nci-primary dropdown-toggle px-3"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "Export"}
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu show" style={{ right: 0, left: "auto" }}>
              <li><button className="dropdown-item" onClick={handleExportDEG}>DEG Table Results (.xlsx)</button></li>
              <li><button className="dropdown-item" onClick={handleExportNormalXlsx}>Normalized Data (.xlsx)</button></li>
              <li><button className="dropdown-item" onClick={handleExportNormalTsv}>Normalized Data (.tsv)</button></li>
            </ul>
          )}
        </div>
      </TableControls>

      {/* Table */}
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table className="table table-sm table-striped table-hover table-borderless mb-0 analysis-table" style={{ fontSize: "1rem" }}>
          <thead>
            {/* Search row */}
            <tr>
              {COLUMNS.map((col) => (
                <th key={`search-${col.key}`} style={{ padding: "4px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ fontSize: "0.85rem" }}
                    placeholder={col.label}
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
                    <CellTooltip key={col.key} content={String(row[col.key] ?? "")} tdStyle={{ maxWidth: col.key === "DESC" ? "200px" : undefined }}>
                      {formatCell(row[col.key], col.fmt, col.link)}
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
