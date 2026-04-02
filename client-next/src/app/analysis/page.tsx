// Legacy: client/src/components/Analysis/Analysis.js
"use client";

import { useState } from "react";

export default function Analysis() {
  const [analysisType, setAnalysisType] = useState("0");

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
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
            >
              <option value="0">GEO Data</option>
              <option value="1">CEL Files</option>
            </select>

            {analysisType === "0" ? (
              <>
                <label className="title" htmlFor="accessionCode">Accession Code<span className="required"> *</span></label>
                <input className="form-control form-control-sm mb-2" id="accessionCode" type="text" />

                <label className="title" htmlFor="chip">Include Chip(s)</label>
                <input className="form-control form-control-sm mb-2" id="chip" type="text" placeholder="<All Chips>" />

                <button className="btn btn-nci-primary w-100 mt-2">Load</button>
                <button className="btn btn-nci-primary w-100 mt-2">Reset</button>
              </>
            ) : (
              <>
                <label className="file-upload-btn my-1" htmlFor="celUpload">
                  <svg className="file-upload-icon" viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></svg> Select File
                </label>
                <input className="d-none" id="celUpload" type="file" accept=".cel,.CEL,.gz" multiple />

                <div className="d-flex gap-4 mt-2">
                  <button className="btn btn-nci-primary flex-fill">Load</button>
                  <button className="btn btn-nci-primary flex-fill">Reset</button>
                </div>
              </>
            )}
          </div>

          {/* Block 2: Contrast */}
          <div className="workflow-block">
            <label className="title mb-2" htmlFor="selectGroup1">Choose Contrast To Show:<span className="required"> *</span></label>
            <select className="form-select form-select-sm mb-1" id="selectGroup1">
              <option value="-1">-- Select Group 1 --</option>
            </select>
            <select className="form-select form-select-sm" id="selectGroup2">
              <option value="-1">-- Select Group 2 --</option>
            </select>
          </div>

          {/* Block 3: Normalization */}
          <div className="workflow-block">
            <label className="title mb-2" htmlFor="selectNormal">Choose Normalization<br />Method:</label>
            <select className="form-select form-select-sm" id="selectNormal">
              <option value="RMA">RMA</option>
              <option value="RMA_Loess">RMA plus Cyclic Loess</option>
            </select>
          </div>

          {/* Block 4: Queue */}
          <div className="workflow-block">
            <div className="form-check mb-1">
              <input className="form-check-input" type="checkbox" id="queueCheckbox" defaultChecked />
              <label className="form-check-label" style={{ fontSize: "0.85em" }} htmlFor="queueCheckbox">Submit this job to a Queue</label>
            </div>
            <small className="text-muted fst-italic d-block mb-2" style={{ fontSize: "0.75em" }}>(Jobs currently enqueued: 0)</small>

            <label className="title" htmlFor="inputEmail">Email<span className="required"> *</span></label>
            <input className="form-control form-control-sm mb-2" id="inputEmail" type="email" placeholder="-- Enter Email --" />

            <small className="text-muted fst-italic" style={{ fontSize: "0.75em" }}>Note: if sending to queue, when computation is completed, a notification will be sent to the e-mail entered above.</small>
          </div>

          {/* Run / Reset buttons (outside sub-boxes) */}
          <div className="mx-2 mb-2">
            <button className="btn btn-nci-primary w-100 mb-2">Run Contrast</button>
            <button className="btn btn-nci-primary w-100">Reset</button>
          </div>
        </div>

        {/* Right Panel — Results */}
        <div className="flex-grow-1">
          <h2>Results</h2>

          {/* Tab Navigation */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <span className="nav-link active">GSM Data</span>
            </li>
            <li className="nav-item">
              <span className="nav-link">Pre-Normalization QC</span>
            </li>
            <li className="nav-item">
              <span className="nav-link">Post-Normalization</span>
            </li>
            <li className="nav-item">
              <span className="nav-link">DEG-Enrichments</span>
            </li>
            <li className="nav-item">
              <span className="nav-link">ssGSEA</span>
            </li>
          </ul>

          {/* Tab Content */}
          <div>
            <h3>GSM Data</h3>
            <p>Sample metadata table placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
