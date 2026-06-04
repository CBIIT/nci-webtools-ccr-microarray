// Shared component for PUGTable and PDGTable
"use client";

import { useState, useEffect, useCallback } from "react";
import { AiOutlineAreaChart } from "react-icons/ai";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getUpPathways, getDownPathways, getPathwayHeatmap, getNormalAll } from "@/services/api";
import TableControls from "./TableControls";
import formatCell from "./formatCell";
import CellTooltip from "./CellTooltip";
import { buildSettingsRows, exportTableToXlsx, exportNormalizedXlsx, exportNormalizedTsv } from "@/utils/exportTable";

const EXPORT_COLUMNS = [
  { key: "Pathway_Name", label: "Pathway_Name" },
  { key: "Category", label: "Category" },
  { key: "P_Value", label: "P_Value" },
  { key: "FDR", label: "FDR" },
  { key: "Enrichment_Score", label: "Enrichment_Score" },
  { key: "Percent_Gene_Hits_per_Pathway", label: "Percent_Gene_Hits_per_Pathway" },
  { key: "Significant_Genes_IN_Pathway", label: "Significant_Genes_IN_Pathway" },
  { key: "Non-Significant_genes_IN_Pathway", label: "Non-Significant_genes_IN_Pathway" },
  { key: "Significant_genes_NOT_IN_Pathway", label: "Significant_genes_NOT_IN_Pathway" },
  { key: "Non-Significant_Genes_NOT_IN_Pathway", label: "Non-Significant_Genes_NOT_IN_Pathway" },
  { key: "Pathway_ID", label: "Pathway_ID" },
  { key: "Gene_List", label: "Gene_List" },
];

const COLUMNS = [
  { key: "Pathway_Name", label: "Pathway Name", search: "Pathway_Name", wide: true },
  { key: "Category", label: "Category", search: "Category" },
  { key: "P_Value", label: "P Value", search: "P_Value", fmt: "exp" },
  { key: "FDR", label: "FDR", search: "FDR", fmt: "exp" },
  { key: "Enrichment_Score", label: "Enrich. Score", search: "Enrichment_Score" },
  { key: "Percent_Gene_Hits_per_Pathway", label: "% Genes", search: "Percent_Gene_Hits_per_Pathway" },
  { key: "Significant_Genes_IN_Pathway", label: "Sig. IN", search: "Significant_Genes_IN_Pathway" },
  { key: "Non-Significant_genes_IN_Pathway", label: "Nonsig. IN", search: "Non-Significant_genes_IN_Pathway" },
  { key: "Significant_genes_NOT_IN_Pathway", label: "Sig. NOT IN", search: "Significant_genes_NOT_IN_Pathway" },
  { key: "Non-Significant_Genes_NOT_IN_Pathway", label: "Nonsig. NOT IN", search: "Non-Significant_Genes_NOT_IN_Pathway" },
  { key: "Pathway_ID", label: "Pathway ID", search: "Pathway_ID" },
  { key: "Gene_List", label: "Gene List", search: "Gene_List" },
];

interface PathwaysTableProps {
  direction: "up" | "down";
}

export default function PathwaysTable({ direction }: PathwaysTableProps) {
  const store = useAnalysisStore();
  const fetchFn = direction === "up" ? getUpPathways : getDownPathways;

  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [pageNumber, setPageNumber] = useState(1);
  const [sorting, setSorting] = useState<{ name: string; order: string }>({ name: "P_Value", order: "ascend" });
  const [search, setSearch] = useState<Record<string, string>>({
    Pathway_Name: "",
    Category: "",
    P_Value: "0.05",
    FDR: "",
    Enrichment_Score: "",
    Percent_Gene_Hits_per_Pathway: "",
    Significant_Genes_IN_Pathway: "",
    "Non-Significant_genes_IN_Pathway": "",
    Significant_genes_NOT_IN_Pathway: "",
    "Non-Significant_Genes_NOT_IN_Pathway": "",
    Pathway_ID: "",
    Gene_List: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (page: number, size: number, sort: { name: string; order: string }, searchKw: Record<string, string>) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchFn({
        projectId: store.projectId,
        page_size: size,
        page_number: page,
        sorting: sort,
        search_keyword: searchKw,
      });
      setRecords(result.records);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pathways");
    } finally {
      setLoading(false);
    }
  }, [store.projectId, fetchFn]);

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

  async function handleHeatmap(pathwayName: string) {
    const newTab = window.open("/assets/loading.html", "_blank");
    try {
      const upOrDown = direction === "up" ? "upregulated_pathways" : "downregulated_pathways";
      const result = await getPathwayHeatmap(store.projectId, store.group1, store.group2, upOrDown, pathwayName);
      if (newTab) {
        const parsed = typeof result === "string" ? JSON.parse(result) : result;
        const picName = parsed?.pic_name;
        if (picName) {
          newTab.location.href = `${window.location.origin}/images/${store.projectId}/${picName}`;
        } else {
          newTab.location.href = `${window.location.origin}/assets/noheatmap.html`;
        }
      }
    } catch {
      if (newTab) newTab.location.href = `${window.location.origin}/assets/noheatmap.html`;
      setError("Failed to generate heatmap");
    }
  }

  const [exporting, setExporting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dirLabel = direction === "up" ? "Upregulated" : "Downregulated";

  async function handleExportPathways() {
    setExporting(true);
    setDropdownOpen(false);
    try {
      const result = await fetchFn({
        projectId: store.projectId,
        page_size: 100000,
        page_number: 1,
        sorting,
        search_keyword: search,
      });
      await exportTableToXlsx(
        buildSettingsRows(store, {
          type: direction === "up" ? "Pathways_For_Upregulated_Genes" : "Pathways_For_Downregulated_Genes",
          filters: [
            ["Pathway_Name", search.Pathway_Name],
            ["Category", search.Category],
            ["P_Value", search.P_Value],
            ["FDR", search.FDR],
            ["Enrichment_Score", search.Enrichment_Score],
            ["Percent_Gene_Hits_per_Pathway", search.Percent_Gene_Hits_per_Pathway],
            ["Significant_Genes_IN_Pathway", search.Significant_Genes_IN_Pathway],
            ["Non-Significant_genes_IN_Pathway", search["Non-Significant_genes_IN_Pathway"]],
            ["Significant_genes_NOT_IN_Pathway", search.Significant_genes_NOT_IN_Pathway],
            ["Non-Significant_Genes_NOT_IN_Pathway", search["Non-Significant_Genes_NOT_IN_Pathway"]],
            ["Pathway_ID", search.Pathway_ID],
            ["Gene_List", search.Gene_List],
          ],
        }),
        EXPORT_COLUMNS,
        result.records,
        `Pathways_${dirLabel}_${store.projectId}.xlsx`
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
              <li><button className="dropdown-item" onClick={handleExportPathways}>Pathways for {dirLabel} Genes (.xlsx)</button></li>
              <li><button className="dropdown-item" onClick={handleExportNormalXlsx}>Normalized Data (.xlsx)</button></li>
              <li><button className="dropdown-item" onClick={handleExportNormalTsv}>Normalized Data (.tsv)</button></li>
            </ul>
          )}
        </div>
      </TableControls>

      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table className="table table-sm table-striped table-hover table-borderless mb-0 analysis-table" style={{ fontSize: "1rem" }}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={`search-${col.key}`} style={{ padding: "4px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ fontSize: "0.85rem", textOverflow: "ellipsis" }}
                    placeholder={col.label}
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
                  style={{ whiteSpace: "nowrap", cursor: "pointer", userSelect: "none", background: "#fafafa", fontSize: "0.85rem" }}
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
                    <CellTooltip key={col.key} content={String(row[col.key] ?? "")} tdStyle={{ maxWidth: col.wide ? "200px" : "120px" }}>
                      {col.key === "Pathway_ID" ? (
                        <button
                          className="btn btn-link btn-sm p-0"
                          style={{ fontSize: "0.85rem" }}
                          onClick={() => handleHeatmap(String(row.Pathway_Name || ""))}
                        >
                          <AiOutlineAreaChart style={{ marginRight: "3px", verticalAlign: "middle" }} />
                          {String(row[col.key] || "")}
                        </button>
                      ) : (
                        formatCell(row[col.key], col.fmt)
                      )}
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
