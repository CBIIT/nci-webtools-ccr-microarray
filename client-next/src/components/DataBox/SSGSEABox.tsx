// Legacy: client/src/components/DataBox/SSGSEATable.js (combined table + heatmap)
"use client";

import { useState, useEffect, useRef } from "react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getssGSEAWithDiffGenSet } from "@/services/api";
import SSGSEATable from "./SSGSEATable";

type SubView = "table" | "heatmap";

const HUMAN_GENE_SETS = [
  { value: "human$H: Hallmark Gene Sets", label: "H: Hallmark Gene Sets" },
  { value: "human$C1: Positional Gene Sets", label: "C1: Positional Gene Sets" },
  { value: "human$C2: Curated Gene Sets", label: "C2: Curated Gene Sets" },
  { value: "human$C3: Motif Gene Sets", label: "C3: Motif Gene Sets" },
  { value: "human$C4: Computational Gene Sets", label: "C4: Computational Gene Sets" },
  { value: "human$C5: GO gene sets", label: "C5: GO gene sets" },
  { value: "human$C6: Oncogenic Signatures", label: "C6: Oncogenic Signatures" },
  { value: "human$C7: Immunologic Signatures", label: "C7: Immunologic Signatures" },
];

const MOUSE_GENE_SETS = [
  { value: "mouse$Co-expression", label: "Co-expression" },
  { value: "mouse$Gene Ontology", label: "Gene Ontology" },
  { value: "mouse$Curated Pathway", label: "Curated Pathway" },
  { value: "mouse$Metabolic", label: "Metabolic" },
  { value: "mouse$TF targets", label: "TF targets" },
  { value: "mouse$miRNA targets", label: "miRNA targets" },
  { value: "mouse$Location", label: "Location" },
];

export default function SSGSEABox() {
  const store = useAnalysisStore();
  const [selected, setSelected] = useState<SubView>("table");
  const [genSet, setGenSet] = useState("human$H: Hallmark Gene Sets");
  const [heatmapUrl, setHeatmapUrl] = useState("");
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [heatmapError, setHeatmapError] = useState("");
  const [generating, setGenerating] = useState(false);
  // Increment to force SSGSEATable re-mount after data generation
  const [tableKey, setTableKey] = useState(0);
  const initialized = useRef(false);


  // On mount, generate ssGSEA data with default gene set
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    generateSSGSEA(genSet);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function generateSSGSEA(gs: string) {
    setGenerating(true);
    setHeatmapError("");
    try {
      await getssGSEAWithDiffGenSet(
        store.projectId,
        gs.startsWith("mouse$") ? "mouse" : "human",
        gs,
        store.group1,
        store.group2
      );
      setTableKey((k) => k + 1);
    } catch (err) {
      setHeatmapError(err instanceof Error ? err.message : "Failed to generate ssGSEA data");
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenSetChange(newGenSet: string) {
    setGenSet(newGenSet);
    setHeatmapUrl("");
    setHeatmapError("");
    await generateSSGSEA(newGenSet);
  }

  function handleViewChange(view: SubView) {
    setSelected(view);
  }

  return (
    <div>
      <div className="d-flex gap-3 mb-3 flex-wrap align-items-end">
        <div>
          <label htmlFor="ssgsea-view" className="form-label" style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)", fontWeight: "bold" }}>
            ssGSEA section selection
          </label>
          <select
            id="ssgsea-view"
            className="form-select form-select-sm"
            style={{ maxWidth: "250px" }}
            value={selected}
            onChange={(e) => handleViewChange(e.target.value as SubView)}
          >
            <option value="table">Single Sample GSEA</option>
            <option value="heatmap">Pathway Heatmap</option>
          </select>
        </div>
        <div>
          <label htmlFor="gene-set" className="form-label" style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)", fontWeight: "bold" }}>
            ssGSEA Gene Sets selection
          </label>
          <select
            id="gene-set"
            className="form-select form-select-sm"
            style={{ maxWidth: "300px" }}
            value={genSet}
            disabled={generating}
            onChange={(e) => handleGenSetChange(e.target.value)}
          >
            <optgroup label="Human">
              {HUMAN_GENE_SETS.map((gs) => (
                <option key={gs.value} value={gs.value}>{gs.label}</option>
              ))}
            </optgroup>
            <optgroup label="Mouse">
              {MOUSE_GENE_SETS.map((gs) => (
                <option key={gs.value} value={gs.value}>{gs.label}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {generating && <p className="text-muted" style={{ fontSize: "0.85rem" }}>Generating ssGSEA data (this may take a moment)...</p>}
      {heatmapError && <p style={{ color: "#b22222", fontSize: "0.85rem" }}>{heatmapError}</p>}

      {selected === "table" && !generating && tableKey > 0 && <SSGSEATable key={tableKey} />}

      {selected === "heatmap" && !generating && (
        <div>
          {heatmapLoading && <p className="text-muted" style={{ fontSize: "0.85rem" }}>Loading heatmap...</p>}
          {heatmapUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heatmapUrl} alt="ssGSEA Pathway Heatmap" style={{ maxWidth: "100%" }} />
          ) : (
            <p className="text-muted" style={{ fontSize: "0.85rem" }}>
              Heatmap will be available after ssGSEA generation completes. Check the Pathway Heatmap view or change the gene set.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
