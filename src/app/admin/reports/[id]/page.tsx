import Link from "next/link";
import AiAnalysis from "@/components/AiAnalysis";
import {
  buildEntityIndex,
  extractEntities,
  getAdminReportById,
  getAdminReports,
  getRepeatedEntities,
  getRiskScore,
  riskLabels
} from "@/app/admin/data";

type ReportDetailsProps = {
  params: {
    id: string;
  };
};

export default function ReportDetailsPage({ params }: ReportDetailsProps) {
  const report = getAdminReportById(params.id);

  if (!report) {
    return (
      <div className="space-y-6">
        <Link href="/admin" className="text-sm text-sand">
          العودة إلى لوحة الإدارة
        </Link>
        <div className="glass p-6">
          <p className="card-title">البلاغ غير موجود</p>
          <p className="mt-3 text-sm text-slate-300">تأكد من رقم البلاغ أو عد للقائمة.</p>
        </div>
      </div>
    );
  }

  const allReports = getAdminReports();
  const entityIndex = buildEntityIndex(allReports);
  const entities = extractEntities(report.description);
  const repeated = getRepeatedEntities(entities, entityIndex);
  const riskScore = getRiskScore(report.risk, repeated);

  return (
    <div className="space-y-8">
      <Link href="/admin" className="text-sm text-sand">
        العودة إلى لوحة الإدارة
      </Link>

      <div className="glass-strong p-6">
        <p className="badge">تفاصيل البلاغ</p>
        <h1 className="mt-3 text-2xl font-semibold text-white md:text-3xl">{report.id}</h1>
        <p className="mt-2 text-sm text-slate-300">تاريخ الاستلام: {new Date(report.createdAt).toLocaleString("ar-EG")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="glass p-6">
            <p className="card-title">ملخص البلاغ</p>
            <p className="mt-3 text-sm text-slate-300">{report.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-sand">
                الفئة: {report.incidentType}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-ember">
                الخطورة: {riskLabels[report.risk]}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                درجة الخطورة: {riskScore}/100
              </span>
            </div>
          </div>

          <AiAnalysis description={report.description} />

          <div className="glass p-6">
            <p className="card-title">الكيانات المستخرجة</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-400">أرقام الهواتف</p>
                {entities.phones.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">لا يوجد</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-sm text-slate-200">
                    {entities.phones.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400">البريد الإلكتروني</p>
                {entities.emails.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">لا يوجد</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-sm text-slate-200">
                    {entities.emails.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400">الروابط</p>
                {entities.urls.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">لا يوجد</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-sm text-slate-200 break-words">
                    {entities.urls.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="glass p-6">
            <p className="card-title">تنبيهات التكرار</p>
            {repeated.repeatedPhones.length === 0 && repeated.repeatedUrls.length === 0 ? (
              <p className="mt-3 text-sm text-slate-300">لا توجد كيانات مكررة داخل البيانات الحالية.</p>
            ) : (
              <div className="mt-4 space-y-4 text-sm text-slate-200">
                {repeated.repeatedPhones.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400">أرقام مكررة</p>
                    <ul className="mt-2 space-y-1">
                      {repeated.repeatedPhones.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {repeated.repeatedUrls.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400">روابط مكررة</p>
                    <ul className="mt-2 space-y-1">
                      {repeated.repeatedUrls.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6">
            <p className="card-title">بيانات المُبلّغ</p>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <p>
                <span className="text-xs text-slate-400">الاسم:</span> {report.reporterName}
              </p>
              <p>
                <span className="text-xs text-slate-400">الهاتف:</span> {report.reporterPhone}
              </p>
              <p>
                <span className="text-xs text-slate-400">البريد:</span> {report.reporterEmail}
              </p>
              <p>
                <span className="text-xs text-slate-400">المحافظة:</span> {report.governorate}
              </p>
              <p>
                <span className="text-xs text-slate-400">تاريخ الحادث:</span> {report.incidentDate}
              </p>
            </div>
          </div>

          <div className="glass p-6">
            <p className="card-title">الأدلة المرفقة</p>
            {report.evidence.length === 0 ? (
              <p className="mt-3 text-sm text-slate-300">لا توجد ملفات مرفقة.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {report.evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
