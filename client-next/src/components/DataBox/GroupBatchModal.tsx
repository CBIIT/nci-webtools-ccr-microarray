// Legacy: client/src/components/DataBox/DataBox.js (modal section)
"use client";

import { useState, useMemo, useRef } from "react";
import { useAnalysisStore, isValidGroupName } from "@/stores/analysisStore";
import Papa from "papaparse";

type Mode = "group" | "batch" | "upload";

interface GroupBatchModalProps {
  visible: boolean;
  onClose: () => void;
  selectedIndices: number[];
  onClearSelection: () => void;
}

export default function GroupBatchModal({
  visible,
  onClose,
  selectedIndices,
  onClearSelection,
}: GroupBatchModalProps) {
  const store = useAnalysisStore();
  const [mode, setMode] = useState<Mode>("group");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Build maps of group→GSMs and batch→GSMs from dataList
  const { groupMap, batchMap } = useMemo(() => {
    const gMap = new Map<string, string[]>();
    const bMap = new Map<string, string[]>();

    store.dataList.forEach((sample) => {
      if (sample.groups) {
        sample.groups.split(",").forEach((g) => {
          const trimmed = g.trim();
          if (trimmed) {
            if (!gMap.has(trimmed)) gMap.set(trimmed, []);
            gMap.get(trimmed)!.push(sample.gsm);
          }
        });
      }
      if (sample.batch) {
        if (!bMap.has(sample.batch)) bMap.set(sample.batch, []);
        bMap.get(sample.batch)!.push(sample.gsm);
      }
    });

    return { groupMap: gMap, batchMap: bMap };
  }, [store.dataList]);

  const selectedGsms = selectedIndices.map((i) => store.dataList[i]?.gsm).filter(Boolean);

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage("Please enter a name");
      return;
    }
    if (!isValidGroupName(trimmed)) {
      setMessage("The group name only allows letters, numbers, and one underscore (cannot be placed after a number). Must start with a letter. Valid Group Name Example: RNA_1");
      return;
    }
    if (selectedIndices.length === 0) {
      setMessage("Please select some GSM(s) before adding");
      return;
    }

    if (mode === "group") {
      store.assignGroup(selectedIndices, trimmed);
    } else {
      store.assignBatch(selectedIndices, trimmed);
    }

    setMessage("");
    setName("");
    setAdded(true);
  }

  function handleDeleteGroup(groupName: string) {
    const allIndices = store.dataList.map((_, i) => i);
    store.deleteGroup(allIndices, groupName);
  }

  function handleDeleteBatch(batchName: string) {
    const indices = store.dataList
      .map((s, i) => (s.batch === batchName ? i : -1))
      .filter((i) => i !== -1);
    store.deleteBatch(indices);
  }

  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim().toLowerCase(),
      complete: (results) => {
        const rows = (results.data as Record<string, string>[]).map((row) => ({
          gsm: row.gsm?.trim() || "",
          group: row.group?.trim() || "",
          batch: row.batch?.trim() || "",
        }));

        const error = store.importGroupsCsv(rows);
        if (error) {
          setMessage(error);
        } else {
          setMessage("");
          setAdded(true);
        }
      },
      error: () => {
        setMessage("Failed to parse CSV file");
      },
    });

    // Reset file input so the same file can be re-uploaded
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleClose() {
    setMode("group");
    setName("");
    setMessage("");
    if (added) {
      onClearSelection();
    }
    setAdded(false);
    onClose();
  }

  if (!visible) return null;

  return (
    <div className="modal-backdrop-custom" onClick={handleClose}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        {/* Header — blue bar matching legacy antd modal header */}
        <div className="modal-header-custom">
          <h5 className="mb-0">Manage GSM Group(s)/Batch(es)</h5>
          <button className="btn-close btn-close-white" onClick={handleClose} />
        </div>

        <div className="modal-body-custom">
        {/* Radio options + upload button on same row */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-4" style={{ color: "rgba(0,0,0,0.65)", fontSize: "0.85rem", fontWeight: 700 }}>
            <label className="d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
              <input type="radio" name="mode" checked={mode === "group"} onChange={() => setMode("group")} />
              Add Group
            </label>
            <label className="d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
              <input type="radio" name="mode" checked={mode === "batch"} onChange={() => setMode("batch")} />
              Add Batch
            </label>
            <label className="d-flex align-items-center gap-1" style={{ cursor: "pointer" }}>
              <input type="radio" name="mode" checked={mode === "upload"} onChange={() => setMode("upload")} />
              Add Group/Batch from file
            </label>
          </div>

          {/* Upload button + download link, centered in remaining space */}
          <div className="d-flex flex-column align-items-center flex-fill">
            <label
              className="file-upload-btn"
              htmlFor="csvUpload"
              style={{ opacity: mode !== "upload" ? 0.5 : 1, pointerEvents: mode !== "upload" ? "none" : "auto" }}
            >
              <svg className="file-upload-icon" viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></svg>
              Select File (.csv)
            </label>
            <input
              ref={fileRef}
              className="d-none"
              id="csvUpload"
              type="file"
              accept=".csv"
              disabled={mode !== "upload"}
              onChange={handleCsvUpload}
            />
            <a
              href="/assets/sample/GSMGroupsBatches-sample.csv"
              download
              style={{ color: "#005ea2", fontSize: "0.85rem", whiteSpace: "nowrap", marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none" }}
            >
              <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.3.4-13-6.3-13H550V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></svg>
              Download Sample
            </a>
          </div>
        </div>

        {/* Manual assignment section */}
        {!added && mode !== "upload" && (
          <div className="mb-3">
            <div className="mb-2">
              <strong style={{ color: "#215a82" }}>{selectedGsms.length} Selected GSM(s):</strong>
              {selectedGsms.length === 0 && (
                <p style={{ color: "#b22222", fontSize: "0.9rem" }} className="mt-1 mb-0">
                  Please select some GSM(s) before adding as a {mode}
                </p>
              )}
              <textarea
                className="form-control form-control-sm mt-1"
                rows={2}
                value={selectedGsms.join(", ")}
                disabled
              />
            </div>

            <div className="mb-1">
              <span className="fw-bold" style={{ color: "#215a82" }}>Name</span>
              <span style={{ color: "#e41d3d", paddingLeft: "5px" }}>*</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Name (Must start with a letter, a-z or A-Z)"
                value={name}
                disabled={selectedGsms.length === 0}
                onChange={(e) => { setName(e.target.value); setMessage(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
              />
              <button
                className="btn btn-sm btn-nci-primary px-3"
                disabled={selectedGsms.length === 0 || !name.trim()}
                onClick={handleAdd}
              >
                Add
              </button>
            </div>

            {message && (
              <p style={{ color: "#b22222", fontSize: "0.9rem" }} className="mt-1 mb-0">{message}</p>
            )}
          </div>
        )}

        {/* Success message */}
        {added && mode !== "upload" && (
          <p className="text-success mb-3">
            {mode === "group" ? "Group" : "Batch"} added successfully.
          </p>
        )}
        {added && mode === "upload" && (
          <p className="text-success mb-3">Groups/Batches imported successfully.</p>
        )}

        {/* Error from CSV */}
        {message && mode === "upload" && (
          <p className="text-danger mb-3" style={{ fontSize: "0.85rem" }}>{message}</p>
        )}

        {/* Saved Groups table — always shown */}
        <div className="mb-3">
          <p><b style={{ color: "#215a82" }}>Saved Group(s)</b></p>
          <table className="table table-sm table-borderless table-striped mb-0">
            <thead>
              <tr className="modal-table-header">
                <th style={{ width: "25%" }}>GROUP</th>
                <th>GSM(s)</th>
                <th style={{ width: "15%" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {groupMap.size > 0 ? (
                Array.from(groupMap.entries()).map(([group, gsms]) => (
                  <tr key={group}>
                    <td>{group}</td>
                    <td style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>{gsms.join(", ")}</td>
                    <td>
                      <button
                        className="btn btn-link btn-sm p-0" style={{ color: "rgb(0, 0, 255)", textDecoration: "none" }}
                        onClick={() => handleDeleteGroup(group)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-3">No Data</td>
                </tr>
              )}
            </tbody>
            {groupMap.size > 0 && (
              <tfoot>
                <tr className="modal-table-footer"><td colSpan={3}></td></tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Saved Batches table — always shown */}
        <div className="mb-3">
          <p><b style={{ color: "#215a82" }}>Saved Batch(es)</b></p>
          <table className="table table-sm table-borderless table-striped mb-0">
            <thead>
              <tr className="modal-table-header">
                <th style={{ width: "25%" }}>BATCH</th>
                <th>GSM(s)</th>
                <th style={{ width: "15%" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {batchMap.size > 0 ? (
                Array.from(batchMap.entries()).map(([batch, gsms]) => (
                  <tr key={batch}>
                    <td>{batch}</td>
                    <td style={{ fontSize: "0.85rem", wordBreak: "break-all" }}>{gsms.join(", ")}</td>
                    <td>
                      <button
                        className="btn btn-link btn-sm p-0" style={{ color: "rgb(0, 0, 255)", textDecoration: "none" }}
                        onClick={() => handleDeleteBatch(batch)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-3">No Data</td>
                </tr>
              )}
            </tbody>
            {batchMap.size > 0 && (
              <tfoot>
                <tr className="modal-table-footer"><td colSpan={3}></td></tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-nci-primary px-4" onClick={handleClose}>Close</button>
        </div>
        </div>
      </div>
    </div>
  );
}
