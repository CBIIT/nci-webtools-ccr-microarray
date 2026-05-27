import { create } from "zustand";
import type { Sample } from "@/services/api";

// ── Types ───────────────────────────────────────────────────────

export type AnalysisType = "GEO" | "CEL";

export interface AnalysisState {
  // Project
  projectId: string;
  analysisType: AnalysisType;
  accessionCode: string;
  chip: string;

  // Samples & groups
  dataList: Sample[];
  group1: string;
  group2: string;
  availableGroups: string[];

  // Analysis config
  species: string;
  genSet: string;
  normal: string;
  useQueue: boolean;
  email: string;

  // Upload
  fileList: File[];

  // UI flags
  loading: boolean;
  loadingMessage: string;
  dataLoaded: boolean;
  contrastComplete: boolean;
  activeTab: string;

  // Results (plot URLs / data stored after contrast)
  histplotBN: string;
  histplotAN: string;
  heatmap: string;
}

export interface AnalysisActions {
  // Project
  setAnalysisType: (type: AnalysisType) => void;
  setAccessionCode: (code: string) => void;
  setChip: (chip: string) => void;
  generateProjectId: () => void;

  // Samples & groups
  setDataList: (samples: Sample[]) => void;
  setGroup1: (group: string) => void;
  setGroup2: (group: string) => void;
  assignGroup: (indices: number[], group: string) => void;
  updateAvailableGroups: () => void;

  // Analysis config
  setSpecies: (species: string) => void;
  setGenSet: (genSet: string) => void;
  setNormal: (normal: string) => void;
  setUseQueue: (useQueue: boolean) => void;
  setEmail: (email: string) => void;

  // Upload
  setFileList: (files: File[]) => void;

  // UI
  setLoading: (loading: boolean, message?: string) => void;
  setDataLoaded: (loaded: boolean) => void;
  setContrastComplete: (complete: boolean) => void;
  setActiveTab: (tab: string) => void;

  // Results
  setPlotUrls: (urls: { histplotBN?: string; histplotAN?: string; heatmap?: string }) => void;

  // Reset
  reset: () => void;
}

// ── Initial state ───────────────────────────────────────────────

function generateId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

const initialState: AnalysisState = {
  projectId: generateId(),
  analysisType: "GEO",
  accessionCode: "",
  chip: "",

  dataList: [],
  group1: "",
  group2: "",
  availableGroups: [],

  species: "human",
  genSet: "H: Hallmark Gene Sets",
  normal: "RMA",
  useQueue: true,
  email: "",

  fileList: [],

  loading: false,
  loadingMessage: "",
  dataLoaded: false,
  contrastComplete: false,
  activeTab: "gsm",

  histplotBN: "",
  histplotAN: "",
  heatmap: "",
};

// ── Store ───────────────────────────────────────────────────────

export const useAnalysisStore = create<AnalysisState & AnalysisActions>((set, get) => ({
  ...initialState,

  // Project
  setAnalysisType: (type) => set({ analysisType: type }),
  setAccessionCode: (code) => set({ accessionCode: code }),
  setChip: (chip) => set({ chip }),
  generateProjectId: () => set({ projectId: generateId() }),

  // Samples & groups
  setDataList: (samples) => {
    set({ dataList: samples });
    get().updateAvailableGroups();
  },
  setGroup1: (group) => set({ group1: group }),
  setGroup2: (group) => set({ group2: group }),
  assignGroup: (indices, group) => {
    const dataList = [...get().dataList];
    indices.forEach((i) => {
      if (dataList[i]) {
        dataList[i] = { ...dataList[i], groups: group };
      }
    });
    set({ dataList });
    get().updateAvailableGroups();
  },
  updateAvailableGroups: () => {
    const groups = new Set<string>();
    get().dataList.forEach((s) => {
      if (s.groups) {
        s.groups.split(",").forEach((g) => {
          const trimmed = g.trim();
          if (trimmed && trimmed !== "Others") groups.add(trimmed);
        });
      }
    });
    set({ availableGroups: Array.from(groups).sort() });
  },

  // Analysis config
  setSpecies: (species) => set({ species }),
  setGenSet: (genSet) => set({ genSet }),
  setNormal: (normal) => set({ normal }),
  setUseQueue: (useQueue) => set({ useQueue }),
  setEmail: (email) => set({ email }),

  // Upload
  setFileList: (files) => set({ fileList: files }),

  // UI
  setLoading: (loading, message = "") => set({ loading, loadingMessage: message }),
  setDataLoaded: (loaded) => set({ dataLoaded: loaded }),
  setContrastComplete: (complete) => set({ contrastComplete: complete }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Results
  setPlotUrls: (urls) =>
    set((state) => ({
      histplotBN: urls.histplotBN ?? state.histplotBN,
      histplotAN: urls.histplotAN ?? state.histplotAN,
      heatmap: urls.heatmap ?? state.heatmap,
    })),

  // Reset
  reset: () => set({ ...initialState, projectId: generateId() }),
}));
