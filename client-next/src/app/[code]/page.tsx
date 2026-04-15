// Results page — loaded via email link: /{projectId}
// Loads results into the store, then renders the full Analysis page
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
  const store = useAnalysisStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await getResultByProjectId(code);
        useAnalysisStore.setState({ projectId: code });
        store.setContrastResults({
          histplotBN: data.histplotBN,
          histplotAN: data.histplotAN,
          heatmap: data.heatmapolt,
        });
        // Populate GSM table data
        const samples = Object.values(data.gsm as Record<string, Sample>);
        store.setDataList(samples);
        store.setDataLoaded(true);

        store.setContrastComplete(true);
        store.setCompared(true);
        store.setDoneGsea(true);
        store.setActiveTab("gsm");
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results");
        setLoading(false);
      }
    }
    loadResults();
  }, [code]);

  if (loading) {
    return (
      <div className="app-container py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading analysis results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return <Analysis />;
}
