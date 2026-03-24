import { getAllReports, type ReportRecord } from "@/app/lib/mockStore";

export type RiskLevel = "low" | "medium" | "high";

export type AdminReport = {
  id: string;
  createdAt: string;
  incidentDate: string;
  incidentType: string;
  risk: RiskLevel;
  description: string;
  governorate: string;
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  evidence: string[];
};

export type ExtractedEntities = {
  phones: string[];
  emails: string[];
  urls: string[];
};

export const riskLabels: Record<RiskLevel, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع"
};

const baseRiskScore: Record<RiskLevel, number> = {
  low: 30,
  medium: 60,
  high: 85
};

const riskByIncidentType: Record<string, RiskLevel> = {
  "ابتزاز رقمي": "high",
  "احتيال / نصب": "high",
  "اختراق حساب": "medium",
  "انتحال شخصية": "medium",
  "رابط مشبوه": "low",
  "أخرى": "medium"
};

const seedReports: AdminReport[] = [
  {
    id: "EGY-ADM-001",
    createdAt: "2026-03-20T09:45:00Z",
    incidentDate: "2026-03-19",
    incidentType: "ابتزاز رقمي",
    risk: "high",
    description:
      "وصلتني رسالة تهديد بنشر صوري لو ماحوّلتش فلوس. المرسل استخدم الرقم +20 10 1234 5678 وأرسل رابط http://secure-payments-eg.com للدفع.",
    governorate: "القاهرة",
    reporterName: "محمود علي",
    reporterPhone: "+20 10 8888 7777",
    reporterEmail: "mahmoud.ali@mail.com",
    evidence: ["screenshot-1.png", "chat-log.txt"]
  },
  {
    id: "EGY-ADM-002",
    createdAt: "2026-03-20T12:10:00Z",
    incidentDate: "2026-03-20",
    incidentType: "احتيال / نصب",
    risk: "high",
    description:
      "شخص ادعى أنه من الدعم وطلب تحويل 2000 جنيه إلى محفظة. الرقم المستخدم هو +20 10 1234 5678 والرابط كان http://secure-payments-eg.com/confirm.",
    governorate: "الجيزة",
    reporterName: "سارة محمود",
    reporterPhone: "+20 12 5555 2401",
    reporterEmail: "sara.m@mail.com",
    evidence: ["voice-note.mp3"]
  },
  {
    id: "EGY-ADM-003",
    createdAt: "2026-03-19T15:05:00Z",
    incidentDate: "2026-03-18",
    incidentType: "انتحال شخصية",
    risk: "medium",
    description:
      "تم إنشاء حساب ينتحل اسمي ويرسل روابط مشبوهة مثل www.win-prize-eg.com. البريد الظاهر في الرسالة هو support@fake-bank.com.",
    governorate: "الإسكندرية",
    reporterName: "نورهان شريف",
    reporterPhone: "+20 11 3322 1100",
    reporterEmail: "norhan.sharif@mail.com",
    evidence: []
  },
  {
    id: "EGY-ADM-004",
    createdAt: "2026-03-18T18:40:00Z",
    incidentDate: "2026-03-18",
    incidentType: "اختراق حساب",
    risk: "medium",
    description:
      "حساب فيسبوك اتاخد مني واتبعت منه رسائل لجهات الاتصال. استلمت رسالة استرجاع فيها رابط https://fake-reset.com.",
    governorate: "الدقهلية",
    reporterName: "أحمد نبيل",
    reporterPhone: "+20 10 9999 1122",
    reporterEmail: "ahmed.nabil@mail.com",
    evidence: ["reset-link.png"]
  },
  {
    id: "EGY-ADM-005",
    createdAt: "2026-03-17T11:30:00Z",
    incidentDate: "2026-03-17",
    incidentType: "رابط مشبوه",
    risk: "low",
    description:
      "وصلني لينك على واتساب بيقول اكسب جوائز: www.win-prize-eg.com وأرقام تواصل +20 12 9876 5432.",
    governorate: "بورسعيد",
    reporterName: "هبة ياسر",
    reporterPhone: "+20 12 4444 3333",
    reporterEmail: "heba.yasser@mail.com",
    evidence: ["whatsapp-screenshot.png"]
  }
];

const mapStoredReport = (report: ReportRecord): AdminReport => ({
  id: report.id,
  createdAt: report.createdAt,
  incidentDate: report.incidentDate,
  incidentType: report.incidentType,
  risk: riskByIncidentType[report.incidentType] ?? "medium",
  description: report.incidentDescription,
  governorate: report.governorate,
  reporterName: report.fullName,
  reporterPhone: report.phone,
  reporterEmail: report.email,
  evidence: report.evidence.map((file) => file.name)
});

export const getAdminReports = (): AdminReport[] => {
  const storedReports = getAllReports().map(mapStoredReport);
  const combined = [...storedReports, ...seedReports];
  return combined.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getAdminReportById = (id: string) => {
  return getAdminReports().find((report) => report.id === id) ?? null;
};

const normalizeList = (items: string[]) => {
  const set = new Set(items.map((item) => item.trim()).filter(Boolean));
  return Array.from(set);
};

export const extractEntities = (text: string): ExtractedEntities => {
  const phones = normalizeList(text.match(/(\+?\d[\d\s\-()]{6,}\d)/g) ?? []);
  const emails = normalizeList(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []);
  const urls = normalizeList(text.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi) ?? []);

  return { phones, emails, urls };
};

export const buildEntityIndex = (reports: AdminReport[]) => {
  const phoneCounts = new Map<string, number>();
  const urlCounts = new Map<string, number>();

  reports.forEach((report) => {
    const entities = extractEntities(report.description);

    entities.phones.forEach((phone) => {
      phoneCounts.set(phone, (phoneCounts.get(phone) ?? 0) + 1);
    });

    entities.urls.forEach((url) => {
      urlCounts.set(url, (urlCounts.get(url) ?? 0) + 1);
    });
  });

  return { phoneCounts, urlCounts };
};

export const getRepeatedEntities = (
  entities: ExtractedEntities,
  index: ReturnType<typeof buildEntityIndex>
) => {
  const repeatedPhones = entities.phones.filter((phone) => (index.phoneCounts.get(phone) ?? 0) > 1);
  const repeatedUrls = entities.urls.filter((url) => (index.urlCounts.get(url) ?? 0) > 1);

  return { repeatedPhones, repeatedUrls };
};

export const getRiskScore = (
  risk: RiskLevel,
  repeated?: { repeatedPhones: string[]; repeatedUrls: string[] }
) => {
  let score = baseRiskScore[risk];

  if (repeated) {
    if (repeated.repeatedPhones.length > 0) score += 8;
    if (repeated.repeatedUrls.length > 0) score += 7;
  }

  return Math.min(100, score);
};

export const getIncidentTypes = (reports: AdminReport[]) => {
  const set = new Set(reports.map((report) => report.incidentType));
  return Array.from(set);
};
