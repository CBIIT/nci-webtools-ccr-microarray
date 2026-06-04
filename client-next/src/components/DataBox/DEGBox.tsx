// Legacy: client/src/components/DataBox/DEGBox.js
"use client";

import { useState } from "react";
import { useAnalysisStore } from "@/stores/analysisStore";
import DEGTable from "./DEGTable";
import PathwaysTable from "./PathwaysTable";

type SubView = "deg" | "pathUp" | "pathDown" | "volcano";

export default function DEGBox() {
  const store = useAnalysisStore();
  const [selected, setSelected] = useState<SubView>("deg");
  const [volcanoMounted, setVolcanoMounted] = useState(false);

  function handleViewChange(value: SubView) {
    setSelected(value);
    if (value === "volcano" && !volcanoMounted) {
      setVolcanoMounted(true);
      store.setLoading(true, "Loading Plot");
    }
  }

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="deg-select" className="form-label" style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)", fontWeight: "bold" }}>
          Select DEG-Enrichments View
        </label>
        <select
          id="deg-select"
          className="form-select form-select-sm"
          style={{ maxWidth: "350px" }}
          value={selected}
          onChange={(e) => handleViewChange(e.target.value as SubView)}
        >
          <option value="deg">Differentially Expressed Genes</option>
          <option value="pathUp">Pathways for Upregulated Genes</option>
          <option value="pathDown">Pathways for Downregulated Genes</option>
          <option value="volcano">Interactive Volcano Plot</option>
        </select>
      </div>

      <div style={{ display: selected === "deg" ? "" : "none" }}><DEGTable /></div>
      <div style={{ display: selected === "pathUp" ? "" : "none" }}><PathwaysTable direction="up" /></div>
      <div style={{ display: selected === "pathDown" ? "" : "none" }}><PathwaysTable direction="down" /></div>
      {volcanoMounted && (
        <div style={{ display: selected === "volcano" ? "" : "none" }}>
          <iframe
            title="Volcano Plot"
            src={`/images/${store.projectId}/volcano.html`}
            width="100%"
            height="980px"
            style={{ border: "none" }}
            onLoad={() => store.setLoading(false)}
          />
        </div>
      )}
    </div>
  );
}
