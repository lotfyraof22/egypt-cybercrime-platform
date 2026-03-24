export type AiIncidentType =
  | "blackmail"
  | "scam"
  | "hacked account"
  | "impersonation"
  | "suspicious link"
  | "other";

export type AiRisk = "low" | "medium" | "high";

export type AiAnalysis = {
  incident_type: AiIncidentType;
  summary: string;
  risk: AiRisk;
  entities: {
    phones: string[];
    emails: string[];
    urls: string[];
  };
};

export type AiAnalysisResponse = {
  ok: boolean;
  data?: AiAnalysis;
  provider?: "openai" | "mock";
  error?: string;
};
