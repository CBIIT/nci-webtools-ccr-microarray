// Landing page — shows About content, or loads analysis results if ?projectId is present
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getResultByProjectId, type Sample } from "@/services/api";
import About from "./about/page";
import Analysis from "./analysis/page";

export default function Home() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || searchParams.keys().next().value;
  const hasProjectId = projectId && projectId.length === 32;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasProjectId) return;

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
        s.setDisableContrast(true);
        s.setActiveTab("gsm");
        s.setLoading(false);
      } catch (err) {
        useAnalysisStore.getState().setLoading(false);
        setError(err instanceof Error ? err.message : "Failed to load results");
      }
    }
    loadResults();
  }, [hasProjectId, projectId]);

  if (hasProjectId) {
    if (error) {
      return (
        <div className="app-container py-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      );
    }
    return <Analysis />;
  }

  return <About />;
}
