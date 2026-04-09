// Legacy: client/src/components/DataBox/PostPlotsBox.js
"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getMAplotAN, getBoxplotAN, getPCA, getHeatmap } from "@/services/api";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type SubPlot = "histogram" | "maplots" | "boxplots" | "pca" | "heatmap";

interface BoxPlotData {
  data: number[][];
  color: string[];
  col: string[];
  ylable: string[];
}

interface PCAData {
  x: number[];
  y: number[];
  z: number[];
  color: string[];
  group_name: string[];
  row: string[];
  col: string[];
  xlable: string;
  ylable: string;
  zlable: string;
}

export default function PostPlotsBox() {
  const store = useAnalysisStore();
  const [selected, setSelected] = useState<SubPlot>("histogram");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cached plot data
  const [maPlots, setMaPlots] = useState<string[][] | null>(null);
  const [boxplotData, setBoxplotData] = useState<BoxPlotData | null>(null);
  const [pcaData, setPcaData] = useState<PCAData | null>(null);
  const [heatmapUrl, setHeatmapUrl] = useState("");

  const fetchPlot = useCallback(async (plot: SubPlot) => {
    setError("");
    if (plot === "histogram") return;
    if (plot === "heatmap") {
      if (!heatmapUrl && store.heatmap) {
        setHeatmapUrl(`/images/${store.projectId}${store.heatmap}`);
      }
      return;
    }
    setLoading(true);
    try {
      switch (plot) {
        case "maplots": {
          if (!maPlots) {
            const data = await getMAplotAN(store.projectId);
            setMaPlots(data as string[][]);
          }
          break;
        }
        case "boxplots": {
          if (!boxplotData) {
            const data = await getBoxplotAN(store.projectId);
            setBoxplotData(data as BoxPlotData);
          }
          break;
        }
        case "pca": {
          if (!pcaData) {
            const data = await getPCA(store.projectId);
            setPcaData(data as PCAData);
          }
          break;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load plot");
    } finally {
      setLoading(false);
    }
  }, [maPlots, boxplotData, pcaData, heatmapUrl, store.projectId, store.heatmap]);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as SubPlot;
    setSelected(value);
    fetchPlot(value);
  }

  // Build per-sample group assignment
  const sampleGroups = store.dataList.map((s) => {
    const gs = s.groups ? s.groups.split(",").map((g) => g.trim()) : [];
    if (gs.includes(store.group1)) return store.group1;
    if (gs.includes(store.group2)) return store.group2;
    return "Others";
  });

  const histUrl = `/images/${store.projectId}/${store.histplotAN}`;
  const resolvedHeatmapUrl = heatmapUrl || (store.heatmap ? `/images/${store.projectId}${store.heatmap}` : "");

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="post-plot-select" className="form-label" style={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)" }}>
          Select Post-Normalization Plots
        </label>
        <select
          id="post-plot-select"
          className="form-select form-select-sm"
          style={{ maxWidth: "300px" }}
          value={selected}
          onChange={handleSelect}
        >
          <option value="histogram">Histogram</option>
          <option value="maplots">MA Plots</option>
          <option value="boxplots">Boxplots</option>
          <option value="pca">PCA</option>
          <option value="heatmap">Heatmap</option>
        </select>
      </div>

      {error && <p style={{ color: "#b22222", fontSize: "0.85rem" }}>{error}</p>}
      {loading && <p className="text-muted" style={{ fontSize: "0.85rem" }}>Loading Plot...</p>}

      {/* Histogram — iframe */}
      {selected === "histogram" && store.histplotAN && (
        <iframe
          title="Post-Normalization Histogram"
          src={histUrl}
          width="100%"
          height="980px"
          style={{ border: "none" }}
        />
      )}

      {/* MA Plots — JPG grid */}
      {selected === "maplots" && maPlots && (
        <MAPlotGrid
          pics={maPlots}
          projectId={store.projectId}
          groups={sampleGroups}
          group1={store.group1}
          group2={store.group2}
        />
      )}

      {/* Boxplots */}
      {selected === "boxplots" && boxplotData && (
        <PlotlyBoxPlot data={boxplotData} groups={sampleGroups} group1={store.group1} group2={store.group2} />
      )}

      {/* PCA — 3D scatter */}
      {selected === "pca" && pcaData && (
        <PCAPlot data={pcaData} group1={store.group1} group2={store.group2} />
      )}

      {/* Heatmap — iframe */}
      {selected === "heatmap" && resolvedHeatmapUrl && (
        <iframe
          title="Normalization Heatmap"
          src={resolvedHeatmapUrl}
          width="100%"
          height="980px"
          style={{ border: "none" }}
        />
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
    yaxis: { title: data.ylable?.[0] || "", zeroline: false },
    legend: { x: 1, y: 1, yanchor: "top", xanchor: "center" },
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

// ── PCA 3D Scatter ──────────────────────────────────────────────

interface PCAPlotProps {
  data: PCAData;
  group1: string;
  group2: string;
}

function PCAPlot({ data, group1, group2 }: PCAPlotProps) {
  // Group data by group name, ordered group1 first then group2
  const groupData: Record<string, { x: number[]; y: number[]; z: number[]; color: string[]; row: string[] }> = {};
  let index = 0;

  [group1, group2].forEach((group) => {
    data.group_name.forEach((name, i) => {
      if (name.split(",").includes(group)) {
        if (!groupData[name]) {
          groupData[name] = { x: [], y: [], z: [], color: [], row: [] };
        }
        groupData[name].x.push(data.x[index]);
        groupData[name].y.push(data.y[index]);
        groupData[name].z.push(data.z[index]);
        groupData[name].color.push(data.color[i]);
        groupData[name].row.push(data.row[i]);
        index++;
      }
    });
  });

  const traces: Plotly.Data[] = Object.entries(groupData).map(([name, gd]) => ({
    x: gd.x,
    y: gd.y,
    z: gd.z,
    text: gd.row,
    mode: "markers" as const,
    marker: { size: 10, color: gd.color },
    legendgroup: name,
    name,
    type: "scatter3d" as const,
  }));

  const layout: Partial<Plotly.Layout> = {
    showlegend: true,
    autosize: true,
    margin: { l: 25, r: 25, t: 0, b: 0 },
    scene: {
      camera: { eye: { x: 0, y: 2, z: 1 } },
      xaxis: {
        title: `${data.col[0]} (${data.xlable}%)`,
        backgroundcolor: "#DDDDDD",
        gridcolor: "rgb(255,255,255)",
        showbackground: true,
        zerolinecolor: "rgb(255,255,255)",
      },
      yaxis: {
        title: `${data.col[2]} (${data.ylable}%)`,
        backgroundcolor: "#EEEEEE",
        gridcolor: "rgb(255,255,255)",
        showbackground: true,
        zerolinecolor: "rgb(255,255,255)",
      },
      zaxis: {
        title: `${data.col[1]} (${data.zlable}%)`,
        backgroundcolor: "#cccccc",
        gridcolor: "rgb(255,255,255)",
        showbackground: true,
        zerolinecolor: "rgb(255,255,255)",
      },
    },
  };

  return (
    <div style={{ display: "block", margin: "0 auto", width: "80%" }}>
      <Plot
        data={traces}
        layout={layout}
        useResizeHandler
        style={{ width: "100%", height: "600px" }}
      />
    </div>
  );
}
