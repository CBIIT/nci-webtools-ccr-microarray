// Legacy: client/src/components/Analysis/Analysis.js
"use client";

import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAnalysisStore } from "@/stores/analysisStore";
import { loadGSE, uploadCEL } from "@/services/api";
import GSMData from "@/components/DataBox/GSMData";

export default function Analysis() {
  const store = useAnalysisStore();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const geoMutation = useMutation({
    mutationFn: () => loadGSE(store.accessionCode, store.projectId, store.loadChip),
    onMutate: () => store.setLoading(true, "Loading GEO Data..."),
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
      alert(err.message);
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
      alert(err.message);
    },
  });

  function handleLoadGEO() {
    if (!store.accessionCode.trim()) return alert("Please enter an accession code.");
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

  function handleReset() {
    store.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const isLoading = store.loading || geoMutation.isPending || celMutation.isPending;

  return (
    <div className="content-board">
      <div className="d-flex flex-column flex-lg-row gap-3">
        {/* Left Panel — Workflow */}
        <div style={{ width: "270px", minWidth: "270px", maxWidth: "270px", border: "1px solid #eee" }}>
          {/* Block 1: Project */}
          <div className="workflow-block">
            <label className="title" htmlFor="analysisType">Choose Analysis Type</label>
            <select
              className="form-select form-select-sm mb-2"
              id="analysisType"
              value={store.analysisType}
              disabled={store.dataLoaded}
              onChange={(e) => store.setAnalysisType(e.target.value as "0" | "1")}
            >
              <option value="0">GEO Data</option>
              <option value="1">CEL Files</option>
            </select>

            {store.analysisType === "0" ? (
              <div key="geo-inputs">
                <label className="title" htmlFor="accessionCode">Accession Code<span className="required"> *</span></label>
                <input
                  className="form-control form-control-sm mb-2"
                  id="accessionCode"
                  type="text"
                  value={store.accessionCode ?? ""}
                  disabled={store.fileList.length > 0}
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
                <button className="btn btn-nci-primary w-100 mt-2" onClick={handleReset} disabled={isLoading}>Reset</button>
              </div>
            ) : (
              <div key="cel-inputs">
                <label className={`file-upload-btn my-1${store.dataLoaded ? " disabled" : ""}`} htmlFor={store.dataLoaded ? undefined : "celUpload"} style={store.dataLoaded ? { opacity: 0.5, pointerEvents: "none" } : undefined}>
                  <svg className="file-upload-icon" viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></svg>
                  {store.fileList.length > 0 ? `${store.fileList.length} file(s) selected` : "Select File"}
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

                <div className="d-flex gap-4 mt-2">
                  <button className={`btn btn-nci-primary flex-fill${celMutation.isPending ? " btn-loading" : ""}`} onClick={handleLoadCEL} disabled={isLoading || store.dataLoaded || store.fileList.length === 0}>
                    {celMutation.isPending && <span className="spinner-border spinner-border-sm me-1" role="status" />}
                    Load
                  </button>
                  <button className="btn btn-nci-primary flex-fill" onClick={handleReset} disabled={isLoading}>Reset</button>
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
                  disabled={store.disableContrast}
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
              value={store.group1 ?? ""}
              disabled={store.disableContrast}
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
              value={store.group2 ?? ""}
              disabled={store.disableContrast}
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
              disabled={store.disableContrast}
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
                onChange={(e) => store.setUseQueue(e.target.checked)}
              />
              <label className="form-check-label" style={{ fontSize: "0.85em" }} htmlFor="queueCheckbox">Submit this job to a Queue</label>
            </div>
            <small className="text-muted fst-italic d-block mb-2" style={{ fontSize: "0.75em" }}>(Jobs currently enqueued: 0)</small>

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

            <small className="text-muted fst-italic" style={{ fontSize: "0.75em" }}>Note: if sending to queue, when computation is completed, a notification will be sent to the e-mail entered above.</small>
          </div>

          {/* Run / Reset buttons (outside sub-boxes) */}
          <div className="mx-2 mb-2">
            <button className="btn btn-nci-primary w-100 mb-2" disabled={!store.dataLoaded || isLoading}>Run Contrast</button>
            <button className="btn btn-nci-primary w-100" onClick={handleReset} disabled={isLoading}>Reset</button>
          </div>
        </div>

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
        <div className="flex-grow-1">
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
            {store.activeTab === "gsm" && <GSMData />}

            {store.activeTab === "pre" && <p className="text-muted">Pre-normalization QC plots will appear here after analysis.</p>}
            {store.activeTab === "post" && <p className="text-muted">Post-normalization plots will appear here after analysis.</p>}
            {store.activeTab === "deg" && <p className="text-muted">DEG-Enrichments results will appear here after analysis.</p>}
            {store.activeTab === "ssgsea" && <p className="text-muted">ssGSEA results will appear here after analysis.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
