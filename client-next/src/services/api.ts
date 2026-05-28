import axios from "axios";

const api = axios.create({
  baseURL: "/api/analysis",
  headers: { "Content-Type": "application/json" },
  timeout: 300000,
});

// ── Response types ──────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  status: number;
  data?: T;
  msg?: string;
}

export interface Sample {
  gsm: string;
  title: string;
  groups: string;
  batch: string;
  _row?: string;
  [key: string]: unknown;
}

export interface PaginatedResult<T = Record<string, unknown>> {
  totalCount: number;
  records: T[];
}

export interface ContrastResult {
  groups: string[];
  histplotBN: string;
  histplotAN: string;
  heatmapolt: string;
  [key: string]: unknown;
}

export interface PaginationParams {
  projectId: string;
  sorting?: { name: string; order: string };
  search_keyword?: Record<string, string>;
  page_size?: number;
  page_number?: number;
}

// ── Response parsers ────────────────────────────────────────────

export interface GSEResult {
  files: Sample[];
  multichip: boolean;
  chips: string[];
  chipData: Record<string, Sample[]>;
}

/** Parse loadGSE response: extract JSON after 'wrapperReturn' delimiter */
function parseGSEResponse(raw: string): GSEResult {
  const idx = raw.indexOf("wrapperReturn");
  if (idx === -1) throw new Error("Invalid GEO response: missing wrapperReturn delimiter");
  const after = raw.substring(idx + 15);

  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeURIComponent(after));
  } catch {
    // R returned an error string, not JSON — surface it as the error message
    const cleaned = after.replace(/^["'\s]+|["'\s]+$/g, "").trim();
    throw new Error(cleaned || "Invalid GEO response format");
  }

  // R returned an error string (not a data object) — throw it as the error message
  if (typeof parsed === "string") {
    throw new Error(parsed);
  }

  // Single-chip: { files: [...] }
  if (typeof parsed === "object" && parsed !== null && "files" in parsed) {
    return { files: (parsed as { files: Sample[] }).files, multichip: false, chips: [], chipData: {} };
  }

  // Multi-chip: { GPL96: [...], GPL97: [...] }
  if (typeof parsed === "object" && parsed !== null && Object.keys(parsed).length) {
    const chips = Object.keys(parsed);
    chips.forEach((chip) => {
      (parsed as Record<string, Sample[]>)[chip].forEach((sample: Sample) => {
        sample.groups = "";
      });
    });
    const firstChip = chips[0];
    return { files: (parsed as Record<string, Sample[]>)[firstChip], multichip: true, chips, chipData: parsed as Record<string, Sample[]> };
  }

  throw new Error("Invalid GEO response format");
}

/** Parse CEL upload response: extract JSON after '+++getCELfiles+++"' delimiter */
function parseCELResponse(raw: string): { files: Sample[] } {
  const parts = raw.split('+++getCELfiles+++"');
  if (parts.length < 2 || !parts[1]) throw new Error("Invalid CEL response: missing getCELfiles delimiter");
  return JSON.parse(decodeURIComponent(parts[1]));
}

// ── Data Loading ────────────────────────────────────────────────

export async function loadGSE(code: string, projectId: string, chip?: string) {
  const res = await api.post<ApiResponse<string>>("/loadGSE", {
    code,
    projectId,
    groups: [],
    batches: [],
    chip: chip || "",
  });
  if (res.data.status !== 200 || !res.data.data) {
    throw new Error(res.data.msg || "Failed to load GEO data");
  }
  return parseGSEResponse(res.data.data);
}

// TODO: consider re-adding upload size limit if needed
// const MAX_UPLOAD_SIZE = 100 * 1024 * 1024;

export async function uploadCEL(projectId: string, files: File[]) {
  // const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  // if (totalSize > MAX_UPLOAD_SIZE) {
  //   throw new Error(`Total file size (${Math.round(totalSize / (1024 * 1024))}MB) exceeds the ${Math.round(MAX_UPLOAD_SIZE / (1024 * 1024))}MB upload limit.`);
  // }

  const formData = new FormData();
  formData.append("projectId", projectId);
  files.forEach((file) => formData.append("cels", file));

  const res = await api.post<ApiResponse<string>>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 0,
  });
  if (res.data.status !== 200 || !res.data.data) {
    throw new Error(res.data.msg || "Failed to upload CEL files");
  }
  const parsed = parseCELResponse(res.data.data);
  // Map _row to gsm (legacy convention)
  parsed.files.forEach((f) => {
    f.gsm = f._row || f.gsm;
    f.groups = "";
  });
  return parsed;
}

export async function getConfiguration() {
  const res = await api.post<ApiResponse>("/getConfiguration");
  return res.data.data;
}

export async function getQueueCount() {
  const res = await api.post<ApiResponse<number>>("/getCurrentNumberOfJobsinQueue");
  return res.data.data ?? 0;
}

// ── Analysis Execution ──────────────────────────────────────────

export interface RunContrastParams {
  projectId: string;
  code: string;
  groups: string[];
  group_1: string;
  group_2: string;
  species: string;
  genSet: string;
  normal: string;
  source: "fetch" | "upload";
  realGroup: string[];
  index: number[];
  batches: string[];
  chip?: string;
}

export async function runContrast(params: RunContrastParams) {
  const res = await api.post<ApiResponse<ContrastResult>>("/runContrast", params);
  if (res.data.status !== 200 || !res.data.data) {
    throw new Error(res.data.msg || "Contrast analysis failed");
  }
  return res.data.data;
}

export interface QueueAnalysisParams extends RunContrastParams {
  email: string;
  dataList: string[];
}

export async function queueAnalysis(params: QueueAnalysisParams) {
  const res = await api.post<ApiResponse>("/qAnalysis", params);
  if (res.data.status !== 200) {
    throw new Error(res.data.msg || "Failed to queue analysis");
  }
}

export async function getResultByProjectId(projectId: string) {
  const res = await api.post<ApiResponse<ContrastResult>>("/getResultByProjectId", { projectId });
  if (res.data.status !== 200 || !res.data.data) {
    throw new Error(res.data.msg || "Failed to load results");
  }
  return res.data.data;
}

// ── Results Tables ──────────────────────────────────────────────

export async function getDEG(params: PaginationParams) {
  const res = await api.post<ApiResponse<PaginatedResult>>("/getDEG", params);
  if (res.data.status !== 200 || !res.data.data) {
    throw new Error(res.data.msg || "Failed to load DEG data");
  }
  return res.data.data;
}

export async function getGSEA(params: PaginationParams) {
  const res = await api.post<ApiResponse<PaginatedResult>>("/getGSEA", params);
  if (res.data.status !== 200 || !res.data.data) {
    throw new Error(res.data.msg || "Failed to load GSEA data");
  }
  return res.data.data;
}

export async function getUpPathways(params: PaginationParams) {
  const res = await api.post<ApiResponse<PaginatedResult>>("/getUpPathWays", params);
  if (res.data.status !== 200 || !res.data.data) {
    throw new Error(res.data.msg || "Failed to load pathways");
  }
  return res.data.data;
}

export async function getDownPathways(params: PaginationParams) {
  const res = await api.post<ApiResponse<PaginatedResult>>("/getDownPathWays", params);
  if (res.data.status !== 200 || !res.data.data) {
    throw new Error(res.data.msg || "Failed to load pathways");
  }
  return res.data.data;
}

// ── Normalized Data ─────────────────────────────────────────────

export async function getNormalAll(projectId: string) {
  const res = await api.post<ApiResponse<Record<string, unknown>[]>>("/getNormalAll", { projectId });
  if (res.data.status !== 200 || !res.data.data) {
    throw new Error(res.data.msg || "Failed to load normalized data");
  }
  return res.data.data;
}

// ── Plots ───────────────────────────────────────────────────────

export async function getPlot(endpoint: string, projectId: string) {
  const res = await api.post<ApiResponse>(`/${endpoint}`, { projectId });
  return res.data.data;
}

export const getHistplotBN = (projectId: string) => getPlot("getHistplotBN", projectId);
export const getHistplotAN = (projectId: string) => getPlot("getHistplotAN", projectId);
export const getBoxplotBN = (projectId: string) => getPlot("getBoxplotBN", projectId);
export const getBoxplotAN = (projectId: string) => getPlot("getBoxplotAN", projectId);
export const getMAplotsBN = (projectId: string) => getPlot("getMAplotsBN", projectId);
export const getMAplotAN = (projectId: string) => getPlot("getMAplotAN", projectId);
export const getPCA = (projectId: string) => getPlot("getPCA", projectId);
export const getHeatmap = (projectId: string) => getPlot("getHeatmapolt", projectId);
export const getRLE = (projectId: string) => getPlot("getRLE", projectId);
export const getNUSE = (projectId: string) => getPlot("getNUSE", projectId);

// ── Pathway Heatmap ─────────────────────────────────────────────

export async function getPathwayHeatmap(
  projectId: string,
  group1: string,
  group2: string,
  upOrDown: string,
  pathway_name: string
) {
  const res = await api.post<ApiResponse>("/pathwaysHeapMap", {
    projectId, group1, group2, upOrDown, pathway_name,
  });
  return res.data.data;
}

// ── ssGSEA with different gene set ──────────────────────────────

export async function getssGSEAWithDiffGenSet(
  projectId: string,
  species: string,
  genSet: string,
  group1: string,
  group2: string
) {
  const res = await api.post<ApiResponse>("/getssGSEAWithDiffGenSet", {
    projectId, species, genSet, group1, group2,
  });
  return res.data.data;
}
