// Results page — loaded via email link: /{projectId}
// Renders the full Analysis page with loading overlay while fetching results
"use client";

import { useEffect, useState, use } from "react";
import { useAnalysisStore } from "@/stores/analysisStore";
import { getResultByProjectId, type Sample } from "@/services/api";
import Analysis from "@/app/analysis/page";

export default function AnalysisWithCode({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [error, setError] = useState("");

  useEffect(() => {
    const s = useAnalysisStore.getState();
    s.setLoading(true, "Loading...");

    async function loadResults() {
      try {
        const data = await getResultByProjectId(code);
        const s = useAnalysisStore.getState();

        // Populate project info (matching legacy getResultByProjectId flow)
        useAnalysisStore.setState({ projectId: code });
        s.setAccessionCode(data.accessionCode as string || "");
        s.setGroup1(data.group_1 as string || "");
        s.setGroup2(data.group_2 as string || "");
        s.setNormal(data.normal as string || "");
        s.setChip(data.chip as string || "");
        if (data.source === "upload") s.setUploaded(true);

        // Populate GSM table with group assignments from results
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

        // Populate contrast results
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
  }, [code]);

  if (error) {
    return (
      <div className="app-container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return <Analysis />;
}
