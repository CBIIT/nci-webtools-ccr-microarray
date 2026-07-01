// Legacy: client/src/components/DataBox/PrePlotsBox.js
"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getMAplotsBN, getBoxplotBN, getRLE, getNUSE } from "@/services/api";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type SubPlot = "histogram" | "maplots" | "boxplots" | "rle" | "nuse";

interface BoxPlotData {
  data: number[][];
  color: string[];
  col: string[];
  ylable: string[];
}

export default function PrePlotsBox() {
  const store = useAnalysisStore();
  const [selected, setSelected] = useState<SubPlot>("histogram");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cached plot data
  const [maPlots, setMaPlots] = useState<string[][] | null>(null);
  const [boxplotData, setBoxplotData] = useState<BoxPlotData | null>(null);
  const [rleData, setRleData] = useState<BoxPlotData | null>(null);
  const [nuseData, setNuseData] = useState<BoxPlotData | null>(null);

  const fetchPlot = useCallback(async (plot: SubPlot) => {
    setError("");
    if (plot === "histogram") return; // iframe, no fetch needed
    setLoading(true);
    try {
      switch (plot) {
        case "maplots": {
          if (!maPlots) {
            const data = await getMAplotsBN(store.projectId);
            setMaPlots(data as string[][]);
          }
          break;
        }
        case "boxplots": {
          if (!boxplotData) {
            const data = await getBoxplotBN(store.projectId);
            setBoxplotData(data as BoxPlotData);
          }
          break;
        }
        case "rle": {
          if (!rleData) {
            const data = await getRLE(store.projectId);
            setRleData(data as BoxPlotData);
          }
          break;
        }
        case "nuse": {
          if (!nuseData) {
            const data = await getNUSE(store.projectId);
            setNuseData(data as BoxPlotData);
          }
          break;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plot");
    } finally {
      setLoading(false);
    }
  }, [maPlots, boxplotData, rleData, nuseData, store.projectId]);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as SubPlot;
    setSelected(value);
    fetchPlot(value);
  }

  // Build per-sample group assignment for MA plot grouping and boxplot coloring
  const sampleGroups = store.dataList.map((s) => {
    const gs = s.groups ? s.groups.split(",").map((g) => g.trim()) : [];
    if (gs.includes(store.group1)) return store.group1;
    if (gs.includes(store.group2)) return store.group2;
    return "Others";
  });

  const histUrl = `/images/${store.projectId}/${store.histplotBN}`;

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="pre-plot-select" className="form-label" style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)", fontWeight: "bold" }}>
          Select Pre-Normalization QC Plots
        </label>
        <select
          id="pre-plot-select"
          className="form-select form-select-sm"
          style={{ maxWidth: "300px" }}
          value={selected}
          onChange={handleSelect}
        >
          <option value="histogram">Histogram</option>
          <option value="maplots">MA Plots</option>
          <option value="boxplots">Boxplots</option>
          <option value="rle">RLE</option>
          <option value="nuse">NUSE</option>
        </select>
      </div>

      {error && <p style={{ color: "#b22222", fontSize: "0.85rem" }}>{error}</p>}
      {loading && <p className="text-muted" style={{ fontSize: "0.85rem" }}>Loading Plot...</p>}

      {selected === "histogram" && store.histplotBN && (
        <iframe
          title="Pre-Normalization Histogram"
          src={histUrl}
          width="100%"
          height="980px"
          style={{ border: "none" }}
        />
      )}

      {selected === "maplots" && maPlots && (
        <MAPlotGrid
          pics={maPlots}
          projectId={store.projectId}
          groups={sampleGroups}
          group1={store.group1}
          group2={store.group2}
        />
      )}

      {selected === "boxplots" && boxplotData && (
        <PlotlyBoxPlot data={boxplotData} groups={sampleGroups} group1={store.group1} group2={store.group2} />
      )}

      {selected === "rle" && rleData && (
        <PlotlyBoxPlot data={rleData} groups={sampleGroups} group1={store.group1} group2={store.group2} />
      )}

      {selected === "nuse" && nuseData && (
        <PlotlyBoxPlot data={nuseData} groups={sampleGroups} group1={store.group1} group2={store.group2} />
      )}
    </div>
  );
}

// ── MA Plot Grid ────────────────────────────────────────────────

interface MAPlotGridProps {
  pics: string[][];
  projectId: string;
  groups: string[];
  group1: string;
  group2: string;
}

function MAPlotGrid({ pics, projectId, groups, group1, group2 }: MAPlotGridProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ [group1]: true, [group2]: true });

  if (!pics || pics.length === 0) return <p className="text-muted">No Data</p>;

  const group1Count = groups.filter((g) => g === group1).length;
  const group1Pics = pics.slice(0, group1Count);
  const group2Pics = pics.slice(group1Count);

  function toggleGroup(group: string) {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  }

  function renderGroup(groupName: string, groupPics: string[][]) {
    const isOpen = openGroups[groupName] ?? true;
    return (
      <div key={groupName} className="mb-3">
        <div
          role="button"
          className="d-flex align-items-center gap-2 p-2"
          style={{ background: "#fafafa", border: "1px solid #dee2e6", borderRadius: "4px", cursor: "pointer" }}
          onClick={() => toggleGroup(groupName)}
        >
          <span style={{ fontSize: "0.7rem" }}>{isOpen ? "▼" : "▶"}</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
            {groupName} ({groupPics.length} {groupPics.length === 1 ? "Sample" : "Samples"})
          </span>
        </div>
        {isOpen && (
          <div className="row g-2 mt-1">
            {groupPics.map((file, i) => (
              <div className="col-md-3" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/${projectId}${file}`}
                  alt={`MA Plot ${i + 1}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {renderGroup(group1, group1Pics)}
      {renderGroup(group2, group2Pics)}
    </div>
  );
}

// ── Plotly Box Plot ─────────────────────────────────────────────

interface PlotlyBoxPlotProps {
  data: BoxPlotData;
  groups: string[];
  group1: string;
  group2: string;
}

function PlotlyBoxPlot({ data, groups, group1, group2 }: PlotlyBoxPlotProps) {
  // Legend traces (one per contrast group)
  const legendTraces: Plotly.Data[] = [];
  const seenGroups = new Set<string>();
  groups.forEach((g, i) => {
    if ((g === group1 || g === group2) && !seenGroups.has(g)) {
      seenGroups.add(g);
      legendTraces.push({
        y: [null],
        type: "box" as const,
        name: g,
        marker: { color: data.color[i] },
        showlegend: true,
        legendgroup: g,
      });
    }
  });

  // Data traces — ordered group1 samples first, then group2
  const names: string[] = [];
  const colors: string[] = [];
  const legendgroups: string[] = [];

  [group1, group2].forEach((group) => {
    groups.forEach((g, i) => {
      if (g === group) {
        names.push(data.col[i]);
        colors.push(data.color[i]);
        legendgroups.push(g);
      }
    });
  });

  const boxTraces: Plotly.Data[] = data.data.map((d, i) => ({
    y: d,
    type: "box" as const,
    name: names[i] || `Sample ${i}`,
    marker: { color: colors[i] || "#ccc" },
    hovertext: names[i],
    showlegend: false,
    legendgroup: legendgroups[i],
  }));

  const layout: Partial<Plotly.Layout> = {
    yaxis: {
      title: { text: data.ylable?.[0] || "" },
      zeroline: false,
    },
    legend: {
      x: 1,
      y: 1,
      yanchor: "top",
      xanchor: "center",
    },
    autosize: true,
  };

  return (
    <Plot
      data={[...legendTraces, ...boxTraces]}
      layout={layout}
      useResizeHandler
      style={{ width: "100%", height: "600px" }}
    />
  );
}
