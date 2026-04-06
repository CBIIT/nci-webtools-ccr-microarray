// Legacy: client/src/components/DataBox/GSMData.js
"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAnalysisStore } from "@/stores/analysisStore";

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
    <th style={{ width, cursor: "pointer" }} onClick={() => onSort(field)}>
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

export default function GSMData() {
  const { dataList, dataLoaded } = useAnalysisStore();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [lastToggled, setLastToggled] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<string>("gsm");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const allSelected = dataList.length > 0 && selected.size === dataList.length;
  const someSelected = selected.size > 0 && !allSelected;

  const headerCheckboxRef = useCallback((el: HTMLInputElement | null) => {
    if (el) el.indeterminate = someSelected;
  }, [someSelected]);

  function toggleAll() {
    setLastToggled(null);
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(dataList.map((_, i) => i)));
    }
  }

  function toggleRow(index: number) {
    setLastToggled(index);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
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

  const sortedData = [...dataList].sort((a, b) => {
    const aVal = String((a as Record<string, unknown>)[sortKey] ?? "");
    const bVal = String((b as Record<string, unknown>)[sortKey] ?? "");
    const cmp = aVal.localeCompare(bVal);
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (!dataLoaded) {
    return (
      <p className="text-muted">
        Choose an Analysis Type on the left panel and click on the Load button to see a list of GSM displayed here.
      </p>
    );
  }

  return (
    <div>
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
            {sortedData.map((sample, i) => (
              <tr key={sample.gsm || i}>
                <td>
                  <input
                    key={lastToggled === i && selected.has(i) ? `${i}-pulse` : `${i}`}
                    className={lastToggled === i && selected.has(i) ? "checkbox-pulse" : ""}
                    type="checkbox"
                    checked={selected.has(i)}
                    onChange={() => toggleRow(i)}
                  />
                </td>
                <Cell>{sample.gsm}</Cell>
                <Cell>{sample.title}</Cell>
                <Cell>{sample.description as string}</Cell>
                <Cell>{sample.groups}</Cell>
                <Cell>{sample.batch}</Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
