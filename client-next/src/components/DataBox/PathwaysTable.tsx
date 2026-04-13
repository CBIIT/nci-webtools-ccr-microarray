// Shared component for PUGTable and PDGTable
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getUpPathways, getDownPathways, getPathwayHeatmap } from "@/services/api";
import TableControls from "./TableControls";
import formatCell from "./formatCell";

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
    "Non-Significant_Genes_NOT_IN_Pathway": "",
    Pathway_ID: "",
    Gene_List: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [heatmapUrl, setHeatmapUrl] = useState("");

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
    setHeatmapLoading(true);
    setHeatmapUrl("");
    try {
      const upOrDown = direction === "up" ? "upregulated_pathways" : "downregulated_pathways";
      const result = await getPathwayHeatmap(store.projectId, store.group1, store.group2, upOrDown, pathwayName);
      if (result) {
        setHeatmapUrl(`/images/${store.projectId}/${result}`);
      }
    } catch {
      setError("Failed to generate heatmap");
    } finally {
      setHeatmapLoading(false);
    }
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
      />

      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table className="table table-sm table-hover table-bordered mb-0" style={{ fontSize: "0.75rem" }}>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={`search-${col.key}`} style={{ padding: "4px" }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ fontSize: "0.7rem" }}
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
                  style={{ whiteSpace: "nowrap", cursor: "pointer", userSelect: "none", background: "#fafafa", fontSize: "0.75rem" }}
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
                    <td key={col.key} style={{ maxWidth: col.wide ? "200px" : "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {col.key === "Pathway_ID" ? (
                        <button
                          className="btn btn-link btn-sm p-0"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => handleHeatmap(String(row.Pathway_Name || ""))}
                          title="View Heatmap"
                        >
                          {String(row[col.key] || "")}
                        </button>
                      ) : (
                        formatCell(row[col.key], col.fmt)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Heatmap display */}
      {heatmapLoading && <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>Generating heatmap...</p>}
      {heatmapUrl && (
        <div className="mt-3">
          <Image src={heatmapUrl} alt="Pathway Heatmap" unoptimized width={800} height={600} style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      )}
    </div>
  );
}
