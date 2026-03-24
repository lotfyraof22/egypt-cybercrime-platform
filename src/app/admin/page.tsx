import Link from "next/link";
import {
  buildEntityIndex,
  extractEntities,
  getAdminReports,
  getIncidentTypes,
  getRepeatedEntities,
  getRiskScore,
  riskLabels,
  type RiskLevel
} from "@/app/admin/data";

type AdminPageProps = {
  searchParams?: {
    type?: string;
    risk?: RiskLevel | "all";
  };
};

export default function AdminPage({ searchParams }: AdminPageProps) {
  const reports = getAdminReports();
  const incidentTypes = getIncidentTypes(reports);
  const entityIndex = buildEntityIndex(reports);

  const selectedType = searchParams?.type ?? "all";
  const selectedRisk = searchParams?.risk ?? "all";

  const filtered = reports.filter((report) => {
    const matchesType = selectedType === "all" || report.incidentType === selectedType;
    const matchesRisk = selectedRisk === "all" || report.risk === selectedRisk;
    return matchesType && matchesRisk;
  });

  const metrics = {
    total: reports.length,
    high: reports.filter((report) => report.risk === "high").length,
    medium: reports.filter((report) => report.risk === "medium").length,
    low: reports.filter((report) => report.risk === "low").length
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">لوحة الإدارة</h1>
        <p className="mt-3 text-sm text-slate-300">
          عرض البلاغات مع فلاتر المخاطر والتنبيهات المتكررة.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="glass p-4">
          <p className="text-2xl font-semibold text-white">{metrics.total}</p>
          <p className="text-xs text-slate-300">إجمالي البلاغات</p>
        </div>
        <div className="glass p-4">
          <p className="text-2xl font-semibold text-white">{metrics.high}</p>
          <p className="text-xs text-slate-300">خطورة مرتفعة</p>
        </div>
        <div className="glass p-4">
          <p className="text-2xl font-semibold text-white">{metrics.medium}</p>
          <p className="text-xs text-slate-300">خطورة متوسطة</p>
        </div>
        <div className="glass p-4">
          <p className="text-2xl font-semibold text-white">{metrics.low}</p>
          <p className="text-xs text-slate-300">خطورة منخفضة</p>
        </div>
      </div>

      <div className="glass p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="card-title">قائمة البلاغات</p>
            <p className="text-xs text-slate-400">بيانات تجريبية + بلاغات مضافة من النموذج</p>
          </div>
          <form method="get" className="flex flex-wrap gap-3">
            <select name="type" className="input w-48" defaultValue={selectedType}>
              <option value="all" className="text-midnight">
                كل الفئات
              </option>
              {incidentTypes.map((type) => (
                <option key={type} value={type} className="text-midnight">
                  {type}
                </option>
              ))}
            </select>
            <select name="risk" className="input w-40" defaultValue={selectedRisk}>
              <option value="all" className="text-midnight">
                كل مستويات الخطورة
              </option>
              {(Object.keys(riskLabels) as RiskLevel[]).map((level) => (
                <option key={level} value={level} className="text-midnight">
                  {riskLabels[level]}
                </option>
              ))}
            </select>
            <button className="rounded-xl bg-sand px-4 text-xs font-semibold text-midnight">
              تطبيق
            </button>
            {(selectedType !== "all" || selectedRisk !== "all") && (
              <Link
                href="/admin"
                className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white"
              >
                مسح الفلاتر
              </Link>
            )}
          </form>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-right text-xs text-slate-400">
                <th className="pb-3">رقم البلاغ</th>
                <th className="pb-3">الفئة</th>
                <th className="pb-3">الخطورة</th>
                <th className="pb-3">درجة الخطورة</th>
                <th className="pb-3">المحافظة</th>
                <th className="pb-3">تاريخ الاستلام</th>
                <th className="pb-3">تنبيهات التكرار</th>
                <th className="pb-3">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td className="py-6 text-center text-sm text-slate-400" colSpan={8}>
                    لا توجد نتائج مطابقة للفلاتر.
                  </td>
                </tr>
              ) : (
                filtered.map((report) => {
                  const entities = extractEntities(report.description);
                  const repeated = getRepeatedEntities(entities, entityIndex);
                  const riskScore = getRiskScore(report.risk, repeated);
                  const flags: string[] = [];

                  if (repeated.repeatedPhones.length > 0) {
                    flags.push("تكرار رقم هاتف");
                  }
                  if (repeated.repeatedUrls.length > 0) {
                    flags.push("تكرار رابط");
                  }

                  return (
                    <tr key={report.id} className="text-slate-200">
                      <td className="py-4 font-semibold text-white">{report.id}</td>
                      <td className="py-4">{report.incidentType}</td>
                      <td className="py-4">
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-sand">
                          {riskLabels[report.risk]}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-slate-200">{riskScore}/100</td>
                      <td className="py-4 text-xs text-slate-300">{report.governorate}</td>
                      <td className="py-4 text-xs text-slate-300">
                        {new Date(report.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="py-4">
                        {flags.length === 0 ? (
                          <span className="text-xs text-slate-400">لا يوجد</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {flags.map((flag) => (
                              <span
                                key={flag}
                                className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[11px] text-slate-200"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        <Link
                          href={`/admin/reports/${report.id}`}
                          className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-white"
                        >
                          عرض
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
