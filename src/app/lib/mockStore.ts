import fs from "fs";
import path from "path";

export type EvidenceFile = {
  name: string;
  size: number;
  type: string;
  storedName?: string;
};

export type ReportRecord = {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  incidentType: string;
  incidentDescription: string;
  incidentDate: string;
  evidence: EvidenceFile[];
};

const storePath = path.join(process.cwd(), "data", "reports.json");

const loadReportsFromDisk = (): ReportRecord[] => {
  try {
    if (!fs.existsSync(storePath)) return [];
    const raw = fs.readFileSync(storePath, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as ReportRecord[];
    }
  } catch {
    return [];
  }
  return [];
};

const persistReports = (reports: ReportRecord[]) => {
  try {
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify(reports, null, 2), "utf8");
  } catch {
    // Ignore disk persistence errors for MVP demo
  }
};

let reportStore: ReportRecord[] = loadReportsFromDisk();

const refreshFromDisk = () => {
  if (!fs.existsSync(storePath)) return;
  reportStore = loadReportsFromDisk();
};

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `EGY-${crypto.randomUUID()}`;
  }
  return `EGY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

type NewReportPayload = Omit<ReportRecord, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
};

export const addReport = (payload: NewReportPayload) => {
  const report: ReportRecord = {
    ...payload,
    id: payload.id ?? createId(),
    createdAt: payload.createdAt ?? new Date().toISOString()
  };
  reportStore.unshift(report);
  persistReports(reportStore);
  return report;
};

export const updateReportEvidence = (id: string, evidence: EvidenceFile[]) => {
  refreshFromDisk();
  const index = reportStore.findIndex((report) => report.id === id);
  if (index === -1) return null;
  reportStore[index] = { ...reportStore[index], evidence };
  persistReports(reportStore);
  return reportStore[index];
};

export const getReportById = (id: string) => {
  refreshFromDisk();
  return reportStore.find((report) => report.id === id) ?? null;
};

export const getAllReports = () => {
  refreshFromDisk();
  return [...reportStore];
};
