// Legacy: client/src/components/Analysis/Analysis.js
"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useAnalysisStore } from "@/stores/analysisStore";
import { loadGSE, uploadCEL, runContrast, queueAnalysis, getResultByProjectId, type Sample } from "@/services/api";
import GSMData from "@/components/DataBox/GSMData";
import PrePlotsBox from "@/components/DataBox/PrePlotsBox";
import PostPlotsBox from "@/components/DataBox/PostPlotsBox";
import DEGBox from "@/components/DataBox/DEGBox";
import SSGSEABox from "@/components/DataBox/SSGSEABox";

// Loads results from query param: /analysis?projectId
function ResultLoader() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const projectId = searchParams.get("projectId") || searchParams.keys().next().value;
    if (!projectId || projectId.length !== 32) return;

    const s = useAnalysisStore.getState();
    s.setLoading(true, "Loading...");

    async function loadResults() {
      try {
        const data = await getResultByProjectId(projectId!);
        const s = useAnalysisStore.getState();

        useAnalysisStore.setState({ projectId });
        s.setAccessionCode(data.accessionCode as string || "");
        s.setGroup1(data.group_1 as string || "");
        s.setGroup2(data.group_2 as string || "");
        s.setNormal(data.normal as string || "");
        s.setChip(data.chip as string || "");
        if (data.source === "upload") s.setUploaded(true);

        const samples = Object.values(data.gsm as Record<string, Sample>);
        const groups = data.groups as string[];
        if (groups) {
          samples.forEach((sample, i) => {
            const g = groups[i];
            sample.groups = (g && g.toLowerCase() !== "others" && g.toLowerCase() !== "ctl") ? g : "";
          });
        }
        s.setDataList(samples);
        s.setDataLoaded(true);

        s.setContrastResults({
          histplotBN: data.histplotBN,
          histplotAN: data.histplotAN,
          heatmap: data.heatmapolt,
        });
        s.setContrastComplete(true);
        s.setCompared(true);
        s.setDoneGsea(true);
        s.setActiveTab("gsm");
        s.setLoading(false);
      } catch (err) {
        useAnalysisStore.getState().setLoading(false);
      }
    }
    loadResults();
  }, [searchParams]);

  return null;
}

function formatErrorMessage(msg: string): string {
  const match = msg.match(/timeout of (\d+)ms/);
  if (match) {
    const minutes = Math.round(parseInt(match[1]) / 60000);
    return `Request timed out after ${minutes} minute${minutes !== 1 ? "s" : ""}. Please try again or submit as a long-running job.`;
  }
  return msg;
}

export default function Analysis() {
  const store = useAnalysisStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadError, setLoadError] = useState("");

  const geoMutation = useMutation({
    mutationFn: () => loadGSE(store.accessionCode, store.projectId, store.loadChip),
    onMutate: () => { store.setLoading(true, "Loading GEO Data..."); setLoadError(""); },
    onSuccess: (data) => {
      if (data.multichip) {
        store.setMultichip(true);
        Object.entries(data.chipData).forEach(([chip, samples]) => {
          store.setDataListChip(chip, samples as import("@/services/api").Sample[]);
        });
        store.setChip(data.chips[0]);
        store.selectChip(data.chips[0]);
      } else {
        store.setDataList(data.files);
      }
      store.setDataLoaded(true);
      store.setLoading(false);
    },
    onError: (err: Error) => {
      store.setLoading(false);
      setLoadError(formatErrorMessage(err.message));
    },
  });

  const celMutation = useMutation({
    mutationFn: () => uploadCEL(store.projectId, store.fileList),
    onMutate: () => store.setLoading(true, "Loading"),
    onSuccess: (data) => {
      store.setDataList(data.files);
      store.setDataLoaded(true);
      store.setLoading(false);
    },
    onError: (err: Error) => {
      store.setLoading(false);
      setLoadError(formatErrorMessage(err.message));
    },
  });

  function handleLoadGEO() {
    if (!store.accessionCode.trim()) return setLoadError("Accession Code is required.");
    setLoadError("");
    geoMutation.mutate();
  }

  function handleLoadCEL() {
    if (store.fileList.length === 0) return alert("Please select CEL files.");
    celMutation.mutate();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) store.setFileList(Array.from(files));
  }

  const [contrastError, setContrastError] = useState("");
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [showQueueWarning, setShowQueueWarning] = useState(false);
  const [showQueueSuccess, setShowQueueSuccess] = useState(false);

  const contrastMutation = useMutation({
    mutationFn: runContrast,
    onSuccess: (data) => {
      store.setContrastResults({
        histplotBN: data.histplotBN,
        histplotAN: data.histplotAN,
        heatmap: data.heatmapolt,
      });
      store.setContrastComplete(true);
      store.setCompared(true);
      store.setDoneGsea(true);
      store.setLoading(false);
      setPanelCollapsed(true);
    },
    onError: (err: Error) => {
      store.setLoading(false);
      setContrastError(err.message);
    },
  });

  function handleRunContrast() {
    setContrastError("");

    if (!store.group1 || !store.group2) {
      setContrastError("Please select both Group 1 and Group 2 for contrast.");
      return;
    }
    if (store.group1 === store.group2) {
      setContrastError("Group 1 and Group 2 must be different.");
      return;
    }

    const payload = store.buildContrastPayload();
    if ("error" in payload) {
      setContrastError(payload.error);
      return;
    }

    // Validate batches: each batch must have samples from both groups
    const batchSamples: Record<string, [boolean, boolean]> = {};
    let allOthers = true;
    store.dataList.forEach((sample, i) => {
      const batch = sample.batch || "";
      if (batch) {
        allOthers = false;
        if (!batchSamples[batch]) batchSamples[batch] = [false, false];
        if (payload.groups[i] === store.group1) batchSamples[batch][0] = true;
        if (payload.groups[i] === store.group2) batchSamples[batch][1] = true;
      }
    });
    for (const batch of Object.keys(batchSamples)) {
      if (!batchSamples[batch][0] || !batchSamples[batch][1]) {
        setContrastError("Cannot run contrasts when batches do not contain samples from each group.");
        return;
      }
    }

    // Compute index (1-based indices of samples in group1 or group2)
    const index: number[] = [];
    payload.groups.forEach((g, i) => {
      if (g === store.group1 || g === store.group2) {
        index.push(i + 1);
      }
    });

    const batches = allOthers ? [] : payload.batches;

    const contrastPayload = {
      projectId: store.projectId,
      code: store.accessionCode,
      groups: payload.groups,
      group_1: store.group1,
      group_2: store.group2,
      species: store.species,
      genSet: store.genSet,
      normal: store.normal,
      source: store.uploaded ? "upload" as const : "fetch" as const,
      realGroup: payload.realGroup,
      index,
      batches,
      chip: store.chip,
    };

    if (store.useQueue) {
      // Async worker path
      if (!store.email || !store.email.trim()) {
        setContrastError("Please enter an email address to receive job completion notification.");
        return;
      }
      store.setLoading(true, "Submitting job...");
      queueAnalysis({
        ...contrastPayload,
        email: store.email,
        dataList: store.dataList.map((d) => d.gsm || ""),
      })
        .then(() => {
          store.setLoading(false);
          store.setJobQueued(true);
          setShowQueueSuccess(true);
        })
        .catch((err: Error) => {
          store.setLoading(false);
          setContrastError(err.message);
        });
    } else {
      // Synchronous path
      store.setLoading(true, "Running Contrast...");
      contrastMutation.mutate(contrastPayload);
    }
  }

  function handleReset() {
    store.reset();
    setLoadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const isLoading = store.loading || geoMutation.isPending || celMutation.isPending;

  return (
    <div className="content-board">
      <Suspense><ResultLoader /></Suspense>
      <div className="d-flex flex-column flex-lg-row gap-3">
        {/* Left Panel — Workflow */}
        {!panelCollapsed && (
        <div style={{ width: "270px", minWidth: "270px", maxWidth: "270px", border: "1px solid #eee" }}>
          {/* Block 1: Project */}
          <div className="workflow-block">
            <label className="title" htmlFor="analysisType">Choose Analysis Type</label>
            <select
              className="form-select form-select-sm mb-2"
              id="analysisType"
              value={store.analysisType}
              disabled={store.dataLoaded}
              onChange={(e) => store.setAnalysisType(e.target.value as "GEO" | "CEL")}
            >
              <option value="GEO">GEO Data</option>
              <option value="CEL">CEL Files</option>
            </select>

            {store.analysisType === "GEO" ? (
              <div key="geo-inputs">
                <label className="title" htmlFor="accessionCode">Accession Code<span className="required"> *</span></label>
                <input
                  className="form-control form-control-sm mb-2"
                  id="accessionCode"
                  type="text"
                  value={store.accessionCode ?? ""}
                  disabled={store.dataLoaded || store.fileList.length > 0}
                  onChange={(e) => store.setAccessionCode(e.target.value)}
                />

                <label className="title" htmlFor="chip">Include Chip(s)</label>
                <input
                  className="form-control form-control-sm mb-2"
                  id="chip"
                  type="text"
                  placeholder="<All Chips>"
                  value={store.loadChip ?? ""}
                  disabled={store.dataLoaded || store.multichip}
                  onChange={(e) => store.setChip(e.target.value.toUpperCase())}
                />

                <button className={`btn btn-nci-primary w-100 mt-2${geoMutation.isPending ? " btn-loading" : ""}`} onClick={handleLoadGEO} disabled={isLoading || store.dataLoaded || store.fileList.length > 0}>
                  {geoMutation.isPending && <span className="spinner-border spinner-border-sm me-1" role="status" />}
                  Load
                </button>
                <button className="btn btn-nci-primary w-100 mt-2" onClick={handleReset} disabled={isLoading} data-tooltip="Reset to start a new GEO Analysis">Reset</button>
              </div>
            ) : (
              <div key="cel-inputs">
                <label className={`file-upload-btn my-1${store.dataLoaded ? " disabled" : ""}`} htmlFor={store.dataLoaded ? undefined : "celUpload"} style={store.dataLoaded ? { opacity: 0.5, pointerEvents: "none" } : undefined}>
                  <svg className="file-upload-icon" viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></svg>
                  Select File
                </label>
                <input
                  ref={fileInputRef}
                  className="d-none"
                  id="celUpload"
                  type="file"
                  accept=".cel,.CEL,.gz"
                  multiple
                  onChange={handleFileSelect}
                />

                {/* File list with individual delete */}
                {store.fileList.length > 0 && (
                  <ul className="cel-file-list">
                    {store.fileList.map((file, i) => (
                      <li key={`${file.name}-${i}`}>
                        <svg viewBox="64 64 896 896" width="1em" height="1em" fill="rgba(0,0,0,0.65)"><path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L225 598.1c-33.6 33.6-52.1 78.3-52.1 125.9 0 47.6 18.5 92.2 52.1 125.8 34.7 34.8 80.3 52.1 125.9 52.1s91.1-17.4 125.8-52.1l266-265.9c60.6-60.6 94-141.2 94-227 .1-85.7-33.3-166.2-93.9-226.8z"/></svg>
                        <span className="cel-file-name">{file.name}</span>
                        {!store.dataLoaded && (
                          <button className="cel-file-delete" onClick={() => store.removeFile(i)} title="Remove file">
                            <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"/></svg>
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="d-flex gap-4 mt-2">
                  <button className={`btn btn-nci-primary flex-fill${celMutation.isPending ? " btn-loading" : ""}`} onClick={handleLoadCEL} disabled={isLoading || store.dataLoaded || store.fileList.length === 0}>
                    {celMutation.isPending && <span className="spinner-border spinner-border-sm me-1" role="status" />}
                    Load
                  </button>
                  <button className="btn btn-nci-primary flex-fill" onClick={handleReset} disabled={isLoading} data-tooltip="Reset to start a new CEL File Analysis">Reset</button>
                </div>
              </div>
            )}
          </div>

          {/* Block 2: Contrast */}
          <div className="workflow-block">
            {store.multichip && (
              <>
                <label className="title mb-1" htmlFor="selectChip">Chip:<span className="required"> *</span></label>
                <select
                  className="form-select form-select-sm mb-2"
                  id="selectChip"
                  value={store.chip ?? ""}
                  onChange={(e) => store.selectChip(e.target.value)}
                  disabled={store.contrastComplete || store.jobQueued}
                >
                  {Object.keys(store.dataListChip).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </>
            )}
            <label className="title mb-2" htmlFor="selectGroup1">Choose Contrast To Show:<span className="required"> *</span></label>
            <select
              className="form-select form-select-sm mb-1"
              id="selectGroup1"
              aria-label="Select Group 1"
              value={store.group1 ?? ""}
              disabled={store.contrastComplete || store.jobQueued}
              onChange={(e) => store.setGroup1(e.target.value)}
            >
              <option value="">-- Select Group 1 --</option>
              {store.availableGroups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select
              className="form-select form-select-sm"
              id="selectGroup2"
              aria-label="Select Group 2"
              value={store.group2 ?? ""}
              disabled={store.contrastComplete || store.jobQueued}
              onChange={(e) => store.setGroup2(e.target.value)}
            >
              <option value="">-- Select Group 2 --</option>
              {store.availableGroups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Block 3: Normalization */}
          <div className="workflow-block">
            <label className="title mb-2" htmlFor="selectNormal">Choose Normalization<br />Method:</label>
            <select
              className="form-select form-select-sm"
              id="selectNormal"
              value={store.normal}
              disabled={store.contrastComplete || store.jobQueued}
              onChange={(e) => store.setNormal(e.target.value)}
            >
              <option value="RMA">RMA</option>
              <option value="RMA_Loess">RMA plus Cyclic Loess</option>
            </select>
          </div>

          {/* Block 4: Queue */}
          <div className="workflow-block">
            <div className="form-check mb-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="queueCheckbox"
                checked={store.useQueue}
                onChange={(e) => {
                  if (e.target.checked) {
                    store.setUseQueue(true);
                  } else {
                    setShowQueueWarning(true);
                  }
                }}
              />
              <label className="form-check-label" style={{ fontSize: "0.85em" }} htmlFor="queueCheckbox">Long-running Job</label>
            </div>

            <label className="title" htmlFor="inputEmail">Email<span className="required"> *</span></label>
            <input
              className="form-control form-control-sm mb-2"
              id="inputEmail"
              type="email"
              placeholder="-- Enter Email --"
              value={store.email ?? ""}
              disabled={!store.useQueue}
              onChange={(e) => store.setEmail(e.target.value)}
            />

            <small className="text-muted fst-italic" style={{ fontSize: "0.75em" }}>You will receive an email when analysis is complete.</small>
          </div>

          {/* Run / Reset buttons (outside sub-boxes) */}
          <div className="mx-2 mb-2">
            <button className="btn btn-nci-primary w-100 mb-2" disabled={!store.dataLoaded || isLoading || store.contrastComplete || store.jobQueued || !store.group1 || !store.group2 || store.group1 === store.group2} onClick={handleRunContrast}>Run Contrast</button>
            <button className="btn btn-nci-primary w-100" onClick={() => { store.resetContrast(); setContrastError(""); setPanelCollapsed(false); }} disabled={isLoading} data-tooltip="Reset to start a new contrast analysis">Reset</button>
            {contrastError && (
              <p style={{ color: "#b22222", fontSize: "0.85rem" }} className="mt-1 mb-0">{contrastError}</p>
            )}
          </div>
        </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-card">
              <div className="spinner-border text-primary mb-3" role="status" />
              <p className="mb-0">{store.loadingMessage}</p>
            </div>
          </div>
        )}

        {/* Right Panel — Results */}
        <div className="flex-grow-1" style={{ position: "relative", minWidth: 0 }}>
          {/* Panel toggle */}
          <button
            onClick={() => setPanelCollapsed((prev) => !prev)}
            style={{ position: "absolute", left: "-12px", top: "16px", background: "none", border: "none", cursor: "pointer", padding: "4px 2px", zIndex: 10 }}
            title={panelCollapsed ? "Show workflow panel" : "Hide workflow panel"}
          >
            <span style={{
              display: "inline-block",
              width: 0,
              height: 0,
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              ...(panelCollapsed
                ? { borderLeft: "7px solid #2971a5" }
                : { borderRight: "7px solid #2971a5" }),
            }} />
          </button>
          {/* Tab Navigation */}
          <ul className="nav nav-tabs results-tabs">
            <li className="nav-item">
              <span
                className={`nav-link ${store.activeTab === "gsm" ? "active" : ""}`}
                role="button"
                onClick={() => store.setActiveTab("gsm")}
              >GSM Data</span>
            </li>
            <li className="nav-item">
              <span
                className={`nav-link ${store.activeTab === "pre" ? "active" : ""} ${!store.contrastComplete ? "disabled" : ""}`}
                role="button"
                onClick={() => store.contrastComplete && store.setActiveTab("pre")}
              >Pre-Normalization QC Plots</span>
            </li>
            <li className="nav-item">
              <span
                className={`nav-link ${store.activeTab === "post" ? "active" : ""} ${!store.contrastComplete ? "disabled" : ""}`}
                role="button"
                onClick={() => store.contrastComplete && store.setActiveTab("post")}
              >Post-Normalization Plots</span>
            </li>
            <li className="nav-item">
              <span
                className={`nav-link ${store.activeTab === "deg" ? "active" : ""} ${!store.contrastComplete ? "disabled" : ""}`}
                role="button"
                onClick={() => store.contrastComplete && store.setActiveTab("deg")}
              >DEG-Enrichments Results</span>
            </li>
            <li className="nav-item">
              <span
                className={`nav-link ${store.activeTab === "ssgsea" ? "active" : ""} ${!store.contrastComplete ? "disabled" : ""}`}
                role="button"
                onClick={() => store.contrastComplete && store.setActiveTab("ssgsea")}
              >ssGSEA Results</span>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content-panel">
            {store.activeTab === "gsm" && (
              <>
                {loadError && <p style={{ color: "#b22222", fontSize: "1.1rem", margin: "1rem" }}>{loadError}</p>}
                {(!loadError || store.dataLoaded) && <GSMData />}
              </>
            )}

            {store.activeTab === "pre" && <PrePlotsBox />}
            {store.activeTab === "post" && <PostPlotsBox />}
            {store.activeTab === "deg" && <DEGBox />}
            {store.activeTab === "ssgsea" && <SSGSEABox />}
          </div>
        </div>
      </div>

      {/* Interactive Mode Warning Modal */}
      {showQueueWarning && (
        <div className="modal-backdrop-custom" onClick={() => setShowQueueWarning(false)}>
          <div className="modal-content-custom" style={{ maxWidth: "500px", minWidth: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="mb-0">Enabling Interactive Mode</h5>
            </div>
            <div className="modal-body-custom">
              <p>Contrasts with large data sets may timeout and not complete in the browser.</p>
              <p>Click OK to enable Interactive mode.</p>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-sm btn-outline-secondary px-3" onClick={() => setShowQueueWarning(false)}>Cancel</button>
                <button className="btn btn-sm btn-nci-primary px-3" onClick={() => { store.setUseQueue(false); setShowQueueWarning(false); }}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Submission Success Modal */}
      {showQueueSuccess && (
        <div className="modal-backdrop-custom" onClick={() => setShowQueueSuccess(false)}>
          <div className="modal-content-custom" style={{ maxWidth: "500px", minWidth: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h5 className="mb-0">MicroArray Job</h5>
            </div>
            <div className="modal-body-custom">
              <p>Your job was submitted for processing. Results will be sent to you via email when all model runs are completed.</p>
              <p>Please note: Depending on model complexity it could be up to a day before you receive your results.</p>
              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-sm btn-nci-primary px-3" onClick={() => setShowQueueSuccess(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
