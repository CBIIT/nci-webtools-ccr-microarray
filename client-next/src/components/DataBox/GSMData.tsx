// Legacy: client/src/components/DataBox/GSMData.js
"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAnalysisStore } from "@/stores/analysisStore";
import GroupBatchModal from "./GroupBatchModal";
import Pagination from "./Pagination";
import writeXlsxFile from "write-excel-file/browser";

interface TooltipState {
  text: string;
  x: number;
  y: number;
}

function Cell({ children }: { children: React.ReactNode }) {
  const text = String(children ?? "");
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const showTooltip = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ text, x: rect.left, y: rect.bottom });
  }, [text]);

  const hideTooltip = useCallback(() => setTooltip(null), []);

  return (
    <td>
      <div className="single-line">
        <span
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          {text}
        </span>
      </div>
      {tooltip && createPortal(
        <div className="cell-tooltip-popup" style={{ left: tooltip.x, top: tooltip.y + 6 }}>
          <div className="cell-tooltip-arrow" />
          {tooltip.text}
        </div>,
        document.body
      )}
    </td>
  );
}

interface SortHeaderProps {
  width: string;
  label: string;
  field: string;
  sortKey: string;
  sortDir: "asc" | "desc";
  onSort: (field: string) => void;
}

function SortHeader({ width, label, field, sortKey, sortDir, onSort }: SortHeaderProps) {
  const isActive = sortKey === field;
  return (
    <th style={{ width, cursor: "pointer", fontWeight: 500 }} onClick={() => onSort(field)}>
      <span className="sort-header">
        {label}
        <span className="sort-arrows">
          <span className={`sort-arrow-up ${isActive && sortDir === "asc" ? "active" : ""}`} />
          <span className={`sort-arrow-down ${isActive && sortDir === "desc" ? "active" : ""}`} />
        </span>
      </span>
    </th>
  );
}

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50, 100, 200];

export default function GSMData() {
  const store = useAnalysisStore();
  const { dataList, dataLoaded } = store;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastToggled, setLastToggled] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortKey, setSortKey] = useState<string>("gsm");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  function toggleRow(gsm: string) {
    setLastToggled(gsm);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(gsm)) {
        next.delete(gsm);
      } else {
        next.add(gsm);
      }
      return next;
    });
  }

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // Filter by search text
  const filteredData = dataList.filter((sample) => {
    if (!searchText) return true;
    const regex = new RegExp(searchText, "i");
    return regex.test(sample.gsm || "") || regex.test(sample.title || "") || regex.test(String(sample.description ?? ""));
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = String((a as Record<string, unknown>)[sortKey] ?? "");
    const bVal = String((b as Record<string, unknown>)[sortKey] ?? "");
    const cmp = aVal.localeCompare(bVal);
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Paginate
  const totalRecords = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalRecords);
  const pagedData = sortedData.slice(startIdx, endIdx);

  const allSelected = sortedData.length > 0 && sortedData.every((s) => selected.has(s.gsm));
  const someSelected = selected.size > 0 && !allSelected;

  const headerCheckboxRef = useCallback((el: HTMLInputElement | null) => {
    if (el) el.indeterminate = someSelected;
  }, [someSelected]);

  function toggleAll() {
    setLastToggled(null);
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sortedData.map((s) => s.gsm)));
    }
  }

  if (!dataLoaded) {
    return (
      <p className="text-muted">
        Choose an Analysis Type on the left panel and click on the Load button to see a list of GSM displayed here.
      </p>
    );
  }

  // Reset to page 1 when search changes
  function handleSearch(value: string) {
    setSearchText(value);
    setCurrentPage(1);
  }

  function handlePageSize(size: number) {
    setPageSize(size);
    setCurrentPage(1);
  }

  async function handleExport() {
    // Sheet 1: Settings
    const settingsData: (string | null)[][] = [
      ["Analysis Type", store.analysisType === "GEO" ? "GEO Data" : "CEL Files"],
      store.analysisType === "GEO"
        ? ["Accession Code", store.accessionCode]
        : ["Upload Data", store.fileList.map((f: File) => f.name).join(", ")],
    ];

    // Sheet 2: Results
    const resultsData: (string | number | null)[][] = [
      ["id", "gsm", "title", "description", "group"],
      ...dataList.map((sample, i) => [
        i + 1,
        sample.gsm,
        sample.title || "",
        (sample.description as string) || "",
        sample.groups || "",
      ]),
    ];

    await writeXlsxFile([settingsData, resultsData], {
      sheets: ["Settings", "Results"],
      fileName: `GSM_${store.projectId}.xlsx`,
    });
  }

  return (
    <div>
      {/* Action buttons */}
      <div className="d-flex justify-content-between mb-2">
        <button className="btn btn-sm btn-nci-primary px-3" onClick={() => setModalVisible(true)}>Manage Groups/Batches</button>
        <button className="btn btn-sm btn-nci-primary px-3" onClick={handleExport}>Export</button>
      </div>

      {/* Search + Pagination controls */}
      <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search text"
            style={{ width: "180px" }}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <div className="d-flex align-items-center gap-1">
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={pageSize}
              onChange={(e) => handlePageSize(Number(e.target.value))}
              aria-label="Rows per page"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-muted" style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>rows per page</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="text-muted" style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
            Showing {totalRecords > 0 ? startIdx + 1 : 0}-{endIdx} of {totalRecords} records
          </span>

          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-sm table-striped table-hover table-borderless gsm-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }}>
                <input
                  key={allSelected ? "all" : someSelected ? "some" : "none"}
                  ref={headerCheckboxRef}
                  className="header-checkbox-animate"
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all samples"
                />
              </th>
              <SortHeader width="16%" label="GSM" field="gsm" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortHeader width="28%" label="Title" field="title" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortHeader width="28%" label="Description" field="description" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortHeader width="14%" label="Group" field="groups" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortHeader width="14%" label="Batch" field="batch" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {pagedData.map((sample, i) => {
              const rowKey = sample.gsm || String(startIdx + i);
              return (
              <tr key={rowKey}>
                <td>
                  <input
                    key={lastToggled === sample.gsm && selected.has(sample.gsm) ? `${sample.gsm}-pulse` : sample.gsm}
                    className={lastToggled === sample.gsm && selected.has(sample.gsm) ? "checkbox-pulse" : ""}
                    type="checkbox"
                    checked={selected.has(sample.gsm)}
                    onChange={() => toggleRow(sample.gsm)}
                    aria-label={`Select ${sample.gsm}`}
                  />
                </td>
                <Cell>{sample.gsm}</Cell>
                <Cell>{sample.title}</Cell>
                <Cell>{sample.description as string}</Cell>
                <Cell>{sample.groups}</Cell>
                <Cell>{sample.batch}</Cell>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <GroupBatchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedGsms={Array.from(selected)}
        onClearSelection={() => { setSelected(new Set()); setLastToggled(null); }}
      />
    </div>
  );
}
