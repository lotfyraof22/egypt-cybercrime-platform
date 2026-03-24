import Link from "next/link";
import AiAnalysis from "@/components/AiAnalysis";
import { getReportById } from "@/app/lib/mockStore";

const fallbackSummary = {
  id: "EGY-2026-0319-045",
  category: "ابتزاز رقمي",
  risk: "مرتفع",
  summary:
    "تم استلام بلاغ عن رسائل تهديد تطالب بتحويل مبالغ مالية مع إرفاق روابط مشبوهة وتكرار رقم هاتف.",
  entities: {
    phones: ["+20 10 1234 5678", "+20 12 9876 5432"],
    emails: ["fraud@fake-mail.com"],
    urls: ["http://secure-payments-eg.com", "http://wallet-confirm.net"]
  }
};

const riskByType: Record<string, string> = {
  "ابتزاز رقمي": "مرتفع",
  "احتيال / نصب": "مرتفع",
  "اختراق حساب": "متوسط",
  "انتحال شخصية": "متوسط",
  "رابط مشبوه": "منخفض",
  "أخرى": "متوسط"
};

const nextSteps = [
  "سيتم مراجعة البلاغ من فريق متخصص خلال 24 ساعة.",
  "قد يتم التواصل معك لطلب تفاصيل إضافية.",
  "احتفظ بنسخة من الأدلة والأرقام المرجعية."
];

type SuccessPageProps = {
  searchParams?: {
    id?: string;
  };
};

export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const report = searchParams?.id ? getReportById(searchParams.id) : null;
  const createdAtLabel = report
    ? new Date(report.createdAt).toLocaleString("ar-EG", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    : null;

  return (
    <div className="space-y-8">
      <div className="glass-strong p-8">
        <p className="badge">تم الاستلام</p>
        <h1 className="mt-4 text-3xl font-semibold text-white md:text-4xl">تم تأكيد البلاغ بنجاح</h1>
        <p className="mt-3 text-sm text-slate-300">
          الرقم المرجعي للمتابعة:{" "}
          <span className="text-sand">{report?.id ?? fallbackSummary.id}</span>
        </p>
        {createdAtLabel && (
          <p className="mt-2 text-xs text-slate-400">تاريخ الاستلام: {createdAtLabel}</p>
        )}
      </div>

      {report ? (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="glass p-6">
              <p className="card-title">ملخص البلاغ</p>
              <p className="mt-3 text-sm text-slate-300">{report.incidentDescription}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-sand">
                  التصنيف: {report.incidentType}
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-ember">
                  الخطورة: {riskByType[report.incidentType] ?? "متوسط"}
                </span>
              </div>
            </div>

            <AiAnalysis description={report.incidentDescription} />

            <div className="glass p-6">
              <p className="card-title">بيانات المبلغ</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">الاسم</p>
                  <p className="mt-1 text-sm text-slate-200">{report.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">رقم الهاتف</p>
                  <p className="mt-1 text-sm text-slate-200">{report.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">البريد الإلكتروني</p>
                  <p className="mt-1 text-sm text-slate-200">{report.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">المحافظة</p>
                  <p className="mt-1 text-sm text-slate-200">{report.governorate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">تاريخ الحادث</p>
                  <p className="mt-1 text-sm text-slate-200">{report.incidentDate}</p>
                </div>
              </div>
            </div>

            <div className="glass p-6">
              <p className="card-title">الملفات المرفقة</p>
              {report.evidence.length === 0 ? (
                <p className="mt-3 text-sm text-slate-300">لم يتم إرفاق ملفات.</p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm text-slate-200">
                  {report.evidence.map((file) => (
                    <li key={`${file.name}-${file.size}`}>
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-6">
              <p className="card-title">الخطوات القادمة</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="glass p-6">
              <p className="card-title">تواصل إضافي</p>
              <p className="mt-3 text-sm text-slate-300">
                يمكنك استخدام رقم البلاغ عند التواصل مع الدعم التقني أو إضافة ملاحظات لاحقًا.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/report"
                  className="rounded-xl bg-oasis px-5 py-2 text-xs font-semibold text-midnight"
                >
                  بلاغ جديد
                </Link>
                <Link
                  href="/"
                  className="rounded-xl border border-white/15 px-5 py-2 text-xs font-semibold text-white"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass p-6">
          <p className="card-title">لم نعثر على تفاصيل البلاغ</p>
          <p className="mt-3 text-sm text-slate-300">
            تأكد من الدخول على صفحة التأكيد بعد إرسال البلاغ مباشرة.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/report"
              className="rounded-xl bg-oasis px-5 py-2 text-xs font-semibold text-midnight"
            >
              قدّم بلاغ جديد
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-white/15 px-5 py-2 text-xs font-semibold text-white"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      )}

      <div className="glass p-6">
        <p className="card-title">ملخص تجريبي للذكاء الاصطناعي</p>
        <p className="mt-3 text-sm text-slate-300">{fallbackSummary.summary}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-sand">
            التصنيف: {fallbackSummary.category}
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-ember">
            الخطورة: {fallbackSummary.risk}
          </span>
        </div>
      </div>
    </div>
  );
}
