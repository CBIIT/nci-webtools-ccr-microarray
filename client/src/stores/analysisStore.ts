import { create } from "zustand";
import type { Sample } from "@/services/api";

// ── Types ───────────────────────────────────────────────────────

export type AnalysisType = "GEO" | "CEL";

export interface PlotData {
  data: unknown[];
  layout: Record<string, unknown>;
  style: Record<string, unknown>;
}

export interface PaginatedTableState {
  data: unknown[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  sorting: string;
  searchKeyword: string;
  loading: boolean;
  message: string;
}

const emptyPlot: PlotData = { data: [], layout: {}, style: {} };

const emptyTable: PaginatedTableState = {
  data: [],
  totalCount: 0,
  pageSize: 10,
  pageNumber: 1,
  sorting: "",
  searchKeyword: "",
  loading: false,
  message: "",
};

export interface AnalysisState {
  // Project
  projectId: string;
  analysisType: AnalysisType;
  accessionCode: string;
  chip: string;
  init: boolean;

  // Multi-chip support
  multichip: boolean;
  dataListChip: Record<string, Sample[]>;
  loadChip: string;

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

  // Filter parameters
  pDEGs: number;
  foldDEGs: number;
  pssGSEA: string;
  foldssGSEA: string;
  pPathways: string;

  // Upload
  fileList: File[];

  // UI flags
  loading: boolean;
  loadingMessage: string;
  uploading: boolean;
  progressing: boolean;
  dataLoaded: boolean;
  uploaded: boolean;
  compared: boolean;
  contrastComplete: boolean;
  jobQueued: boolean;
  doneGsea: boolean;
  disableContrast: boolean;
  activeTab: string;
  queueModalVisible: boolean;
  numberOfTasksInQueue: number;

  // Tab/plot status
  tagPrePlotStatus: string;
  tagPostPlotStatus: string;
  tagDegPlotStatus: string;
  tagSsgeaPlotStatus: string;
  degSelected: string;
  ssSelect: string;

  // Plot URLs (HTML widget results)
  histplotBN: string;
  histplotAN: string;
  heatmap: string;
  maplotsBN: string;
  maplotsAN: string;
  volcanoPlot: string;
  volcanoPlotName: string;
  geneHeatmap: string;

  // Plot data (Plotly JSON)
  boxplotBN: PlotData;
  boxplotAN: PlotData;
  rle: PlotData;
  nuse: PlotData;
  pca: PlotData;

  // Result tables (paginated)
  diffExprGenes: PaginatedTableState;
  ssGSEA: PaginatedTableState;
  pathwaysUp: PaginatedTableState;
  pathwaysDown: PaginatedTableState;
}

// Group/batch name validation — must start with letter, can contain letters/numbers/underscores
const GROUP_NAME_REGEX = /^[a-zA-Z]+_?[a-zA-Z0-9]*$|^[a-zA-Z]+[0-9]*$/;

export function isValidGroupName(name: string): boolean {
  return GROUP_NAME_REGEX.test(name);
}

export interface AnalysisActions {
  // Project
  setAnalysisType: (type: AnalysisType) => void;
  setAccessionCode: (code: string) => void;
  setChip: (chip: string) => void;
  setLoadChip: (loadChip: string) => void;
  generateProjectId: () => void;
  setInit: (init: boolean) => void;

  // Multi-chip
  setMultichip: (multichip: boolean) => void;
  setDataListChip: (chip: string, samples: Sample[]) => void;
  selectChip: (chip: string) => void;

  // Samples & groups
  setDataList: (samples: Sample[]) => void;
  setGroup1: (group: string) => void;
  setGroup2: (group: string) => void;
  assignGroup: (indices: number[], group: string) => void;
  deleteGroup: (indices: number[], group: string) => void;
  assignBatch: (indices: number[], batch: string) => void;
  deleteBatch: (indices: number[]) => void;
  importGroupsCsv: (rows: { gsm: string; group: string; batch: string }[]) => string | null;
  updateAvailableGroups: () => void;
  buildContrastPayload: () =>
    | { groups: string[]; dataList: string[]; batches: string[]; realGroup: string[] }
    | { error: string };

  // Analysis config
  setSpecies: (species: string) => void;
  setGenSet: (genSet: string) => void;
  setNormal: (normal: string) => void;
  setUseQueue: (useQueue: boolean) => void;
  setEmail: (email: string) => void;
  setFilterParams: (params: Partial<Pick<AnalysisState, "pDEGs" | "foldDEGs" | "pssGSEA" | "foldssGSEA" | "pPathways">>) => void;

  // Upload
  setFileList: (files: File[]) => void;
  removeFile: (index: number) => void;

  // UI
  setLoading: (loading: boolean, message?: string) => void;
  setUploading: (uploading: boolean) => void;
  setProgressing: (progressing: boolean) => void;
  setDataLoaded: (loaded: boolean) => void;
  setUploaded: (uploaded: boolean) => void;
  setCompared: (compared: boolean) => void;
  setContrastComplete: (complete: boolean) => void;
  setJobQueued: (queued: boolean) => void;
  setDoneGsea: (done: boolean) => void;
  setDisableContrast: (disable: boolean) => void;
  setActiveTab: (tab: string) => void;
  setQueueModalVisible: (visible: boolean) => void;
  setNumberOfTasksInQueue: (count: number) => void;

  // Tab/plot status
  setTagStatus: (key: "tagPrePlotStatus" | "tagPostPlotStatus" | "tagDegPlotStatus" | "tagSsgeaPlotStatus", status: string) => void;
  setDegSelected: (selected: string) => void;
  setSsSelect: (selected: string) => void;

  // Results — plots
  setPlotUrls: (urls: Partial<Pick<AnalysisState, "histplotBN" | "histplotAN" | "heatmap" | "maplotsBN" | "maplotsAN" | "volcanoPlot" | "volcanoPlotName" | "geneHeatmap">>) => void;
  setPlotData: (key: "boxplotBN" | "boxplotAN" | "rle" | "nuse" | "pca", data: PlotData) => void;

  // Results — tables
  setTableState: (key: "diffExprGenes" | "ssGSEA" | "pathwaysUp" | "pathwaysDown", state: Partial<PaginatedTableState>) => void;

  // Bulk set all results after contrast completes
  setContrastResults: (results: {
    histplotBN?: string;
    histplotAN?: string;
    heatmap?: string;
    maplotsBN?: string;
    maplotsAN?: string;
    boxplotBN?: PlotData;
    boxplotAN?: PlotData;
    rle?: PlotData;
    nuse?: PlotData;
    pca?: PlotData;
    volcanoPlot?: string;
    volcanoPlotName?: string;
    diffExprGenes?: Partial<PaginatedTableState>;
    ssGSEA?: Partial<PaginatedTableState>;
    pathwaysUp?: Partial<PaginatedTableState>;
    pathwaysDown?: Partial<PaginatedTableState>;
  }) => void;

  // Reset
  reset: () => void;
  resetContrast: () => void;
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
  init: false,

  multichip: false,
  dataListChip: {},
  loadChip: "",

  dataList: [],
  group1: "",
  group2: "",
  availableGroups: [],

  species: "human",
  genSet: "H: Hallmark Gene Sets",
  normal: "RMA",
  useQueue: true,
  email: "",

  pDEGs: 0.05,
  foldDEGs: 1.5,
  pssGSEA: "",
  foldssGSEA: "",
  pPathways: "",

  fileList: [],

  loading: false,
  loadingMessage: "",
  uploading: false,
  progressing: false,
  dataLoaded: false,
  uploaded: false,
  compared: false,
  contrastComplete: false,
  jobQueued: false,
  doneGsea: false,
  disableContrast: false,
  activeTab: "gsm",
  queueModalVisible: false,
  numberOfTasksInQueue: 0,

  tagPrePlotStatus: "",
  tagPostPlotStatus: "",
  tagDegPlotStatus: "",
  tagSsgeaPlotStatus: "",
  degSelected: "",
  ssSelect: "",

  histplotBN: "",
  histplotAN: "",
  heatmap: "",
  maplotsBN: "",
  maplotsAN: "",
  volcanoPlot: "",
  volcanoPlotName: "",
  geneHeatmap: "",

  boxplotBN: { ...emptyPlot },
  boxplotAN: { ...emptyPlot },
  rle: { ...emptyPlot },
  nuse: { ...emptyPlot },
  pca: { ...emptyPlot },

  diffExprGenes: { ...emptyTable },
  ssGSEA: { ...emptyTable },
  pathwaysUp: { ...emptyTable },
  pathwaysDown: { ...emptyTable },
};

// ── Store ───────────────────────────────────────────────────────

export const useAnalysisStore = create<AnalysisState & AnalysisActions>((set, get) => ({
  ...initialState,

  // ── Project ──────────────────────────────────────────────────
  setAnalysisType: (type) => set({ analysisType: type }),
  setAccessionCode: (code) => set({ accessionCode: code }),
  setChip: (chip) => set({ chip }),
  setLoadChip: (loadChip) => set({ loadChip }),
  generateProjectId: () => set({ projectId: generateId() }),
  setInit: (init) => set({ init }),

  // ── Multi-chip ───────────────────────────────────────────────
  setMultichip: (multichip) => set({ multichip }),
  setDataListChip: (chip, samples) =>
    set((state) => ({
      dataListChip: { ...state.dataListChip, [chip]: samples },
    })),
  selectChip: (chip) => {
    const { chip: currentChip, dataList, dataListChip } = get();
    // Save current dataList (with group/batch edits) back before switching
    const updated = currentChip && dataList.length > 0
      ? { ...dataListChip, [currentChip]: dataList }
      : dataListChip;
    const chipData = updated[chip];
    if (chipData) {
      set({ chip, dataList: chipData, dataListChip: updated });
      get().updateAvailableGroups();
    }
  },

  // ── Samples & groups ────────────────────────────────────────
  setDataList: (samples) => {
    set({ dataList: samples });
    get().updateAvailableGroups();
  },
  setGroup1: (group) => set({ group1: group }),
  setGroup2: (group) => set({ group2: group }),

  // Append group to selected samples (multi-group: comma-separated, no duplicates)
  assignGroup: (indices, group) => {
    const dataList = [...get().dataList];
    indices.forEach((i) => {
      if (dataList[i]) {
        const existing = dataList[i].groups
          ? dataList[i].groups.split(",").map((g) => g.trim()).filter(Boolean)
          : [];
        if (!existing.includes(group)) {
          existing.push(group);
        }
        dataList[i] = { ...dataList[i], groups: existing.join(",") };
      }
    });
    set({ dataList });
    get().updateAvailableGroups();
  },

  // Remove a specific group from selected samples
  deleteGroup: (indices, group) => {
    const dataList = [...get().dataList];
    indices.forEach((i) => {
      if (dataList[i] && dataList[i].groups) {
        const filtered = dataList[i].groups
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g !== group);
        dataList[i] = { ...dataList[i], groups: filtered.join(",") };
      }
    });
    set({ dataList });
    get().updateAvailableGroups();
  },

  // Set batch for selected samples (single batch per sample, replaces existing)
  assignBatch: (indices, batch) => {
    const dataList = [...get().dataList];
    indices.forEach((i) => {
      if (dataList[i]) {
        dataList[i] = { ...dataList[i], batch };
      }
    });
    set({ dataList });
  },

  // Clear batch for selected samples
  deleteBatch: (indices) => {
    const dataList = [...get().dataList];
    indices.forEach((i) => {
      if (dataList[i]) {
        dataList[i] = { ...dataList[i], batch: "" };
      }
    });
    set({ dataList });
  },

  // Import groups/batches from CSV rows. Returns error string or null on success.
  importGroupsCsv: (rows) => {
    const dataList = [...get().dataList];
    const errors: string[] = [];

    for (const row of rows) {
      const gsm = row.gsm.toUpperCase();
      const idx = dataList.findIndex((s) => s.gsm.toUpperCase() === gsm);

      if (idx === -1) {
        errors.push(`GSM "${row.gsm}" not found`);
        continue;
      }

      if (row.group) {
        if (!isValidGroupName(row.group)) {
          errors.push(`Invalid group name "${row.group}" for ${row.gsm}`);
          continue;
        }
        const existing = dataList[idx].groups
          ? dataList[idx].groups.split(",").map((g) => g.trim()).filter(Boolean)
          : [];
        if (!existing.includes(row.group)) {
          existing.push(row.group);
        }
        dataList[idx] = { ...dataList[idx], groups: existing.join(",") };
      }

      if (row.batch) {
        if (!isValidGroupName(row.batch)) {
          errors.push(`Invalid batch name "${row.batch}" for ${row.gsm}`);
          continue;
        }
        dataList[idx] = { ...dataList[idx], batch: row.batch };
      }
    }

    set({ dataList });
    get().updateAvailableGroups();
    return errors.length > 0 ? errors.join("; ") : null;
  },

  // Rebuild available groups from all samples
  updateAvailableGroups: () => {
    const groups = new Set<string>();
    get().dataList.forEach((s) => {
      if (s.groups) {
        s.groups.split(",").forEach((g) => {
          const trimmed = g.trim();
          if (trimmed) groups.add(trimmed);
        });
      }
    });
    set({ availableGroups: Array.from(groups).sort() });
  },

  // Build the per-sample group/batch arrays for the runContrast API call
  buildContrastPayload: () => {
    const { dataList, group1, group2 } = get();
    const groups: string[] = [];
    const gsmList: string[] = [];
    const batches: string[] = [];
    const realGroup: string[] = [];

    for (const sample of dataList) {
      gsmList.push(sample.gsm);
      batches.push(sample.batch || "Others");

      const sampleGroups = sample.groups
        ? sample.groups.split(",").map((g) => g.trim())
        : [];
      const inG1 = sampleGroups.includes(group1);
      const inG2 = sampleGroups.includes(group2);

      if (inG1 && inG2) {
        return {
          error: `Sample ${sample.gsm} belongs to both "${group1}" and "${group2}". Each sample can only belong to one contrast group.`,
        };
      }

      if (inG1) {
        groups.push(group1);
      } else if (inG2) {
        groups.push(group2);
      } else {
        groups.push("Others");
      }
      realGroup.push(sample.groups || "Others");
    }

    return { groups, dataList: gsmList, batches, realGroup };
  },

  // ── Analysis config ─────────────────────────────────────────
  setSpecies: (species) => set({ species }),
  setGenSet: (genSet) => set({ genSet }),
  setNormal: (normal) => set({ normal }),
  setUseQueue: (useQueue) => set({ useQueue }),
  setEmail: (email) => set({ email }),
  setFilterParams: (params) => set(params),

  // ── Upload ──────────────────────────────────────────────────
  setFileList: (files) => set({ fileList: files }),
  removeFile: (index) => {
    const newList = [...get().fileList];
    newList.splice(index, 1);
    set({ fileList: newList });
  },

  // ── UI ──────────────────────────────────────────────────────
  setLoading: (loading, message = "") => set({ loading, loadingMessage: message }),
  setUploading: (uploading) => set({ uploading }),
  setProgressing: (progressing) => set({ progressing }),
  setDataLoaded: (loaded) => set({ dataLoaded: loaded }),
  setUploaded: (uploaded) => set({ uploaded }),
  setCompared: (compared) => set({ compared }),
  setContrastComplete: (complete) => set({ contrastComplete: complete }),
  setJobQueued: (queued) => set({ jobQueued: queued }),
  setDoneGsea: (done) => set({ doneGsea: done }),
  setDisableContrast: (disable) => set({ disableContrast: disable }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setQueueModalVisible: (visible) => set({ queueModalVisible: visible }),
  setNumberOfTasksInQueue: (count) => set({ numberOfTasksInQueue: count }),

  // ── Tab/plot status ─────────────────────────────────────────
  setTagStatus: (key, status) => set({ [key]: status }),
  setDegSelected: (selected) => set({ degSelected: selected }),
  setSsSelect: (selected) => set({ ssSelect: selected }),

  // ── Results — plots ─────────────────────────────────────────
  setPlotUrls: (urls) => set(urls),
  setPlotData: (key, data) => set({ [key]: data }),

  // ── Results — tables ────────────────────────────────────────
  setTableState: (key, partial) =>
    set((state) => ({
      [key]: { ...state[key], ...partial },
    })),

  // ── Bulk set contrast results ───────────────────────────────
  setContrastResults: (results) => {
    const updates: Partial<AnalysisState> = {};

    if (results.histplotBN !== undefined) updates.histplotBN = results.histplotBN;
    if (results.histplotAN !== undefined) updates.histplotAN = results.histplotAN;
    if (results.heatmap !== undefined) updates.heatmap = results.heatmap;
    if (results.maplotsBN !== undefined) updates.maplotsBN = results.maplotsBN as string;
    if (results.maplotsAN !== undefined) updates.maplotsAN = results.maplotsAN as string;
    if (results.boxplotBN) updates.boxplotBN = results.boxplotBN;
    if (results.boxplotAN) updates.boxplotAN = results.boxplotAN;
    if (results.rle) updates.rle = results.rle;
    if (results.nuse) updates.nuse = results.nuse;
    if (results.pca) updates.pca = results.pca;
    if (results.volcanoPlot !== undefined) updates.volcanoPlot = results.volcanoPlot;
    if (results.volcanoPlotName !== undefined) updates.volcanoPlotName = results.volcanoPlotName;

    set((state) => ({
      ...updates,
      ...(results.diffExprGenes
        ? { diffExprGenes: { ...state.diffExprGenes, ...results.diffExprGenes } }
        : {}),
      ...(results.ssGSEA
        ? { ssGSEA: { ...state.ssGSEA, ...results.ssGSEA } }
        : {}),
      ...(results.pathwaysUp
        ? { pathwaysUp: { ...state.pathwaysUp, ...results.pathwaysUp } }
        : {}),
      ...(results.pathwaysDown
        ? { pathwaysDown: { ...state.pathwaysDown, ...results.pathwaysDown } }
        : {}),
    }));
  },

  // ── Reset Contrast (keep data, re-enable contrast inputs) ──
  resetContrast: () =>
    set({
      email: "",
      group1: "",
      group2: "",
      normal: "RMA",
      disableContrast: false,
      compared: false,
      contrastComplete: false,
      jobQueued: false,
      doneGsea: false,
      activeTab: "gsm",
      histplotBN: "",
      histplotAN: "",
      heatmap: "",
      maplotsBN: "",
      maplotsAN: "",
      volcanoPlot: "",
      volcanoPlotName: "",
      geneHeatmap: "",
      boxplotBN: { ...emptyPlot },
      boxplotAN: { ...emptyPlot },
      rle: { ...emptyPlot },
      nuse: { ...emptyPlot },
      pca: { ...emptyPlot },
      diffExprGenes: { ...emptyTable },
      ssGSEA: { ...emptyTable },
      pathwaysUp: { ...emptyTable },
      pathwaysDown: { ...emptyTable },
    }),

  // ── Reset ───────────────────────────────────────────────────
  reset: () =>
    set({
      ...initialState,
      projectId: generateId(),
      boxplotBN: { ...emptyPlot },
      boxplotAN: { ...emptyPlot },
      rle: { ...emptyPlot },
      nuse: { ...emptyPlot },
      pca: { ...emptyPlot },
      diffExprGenes: { ...emptyTable },
      ssGSEA: { ...emptyTable },
      pathwaysUp: { ...emptyTable },
      pathwaysDown: { ...emptyTable },
      dataListChip: {},
    }),
}));
