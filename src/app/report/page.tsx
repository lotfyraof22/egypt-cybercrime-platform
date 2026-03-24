import ReportForm from "@/components/ReportForm";

const guidanceCards = [
  {
    title: "نصائح للمساعدة",
    items: [
      "اكتب وصفًا مختصرًا ثم أضف التفاصيل المهمة.",
      "حدد وسيلة التواصل المستخدمة (واتساب، بريد، هاتف).",
      "أضف أي روابط أو أرقام ظهرت في الرسائل."
    ]
  },
  {
    title: "خصوصية البيانات",
    items: [
      "تجنب إدخال كلمات مرور أو أرقام بطاقات.",
      "استخدم ملفات مضغوطة إذا كانت الأدلة كبيرة.",
      "قم بمراجعة البلاغ قبل الإرسال النهائي."
    ]
  }
];

export default function ReportPage() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">تقديم بلاغ جديد</h1>
          <p className="mt-3 text-sm text-slate-300">
            املأ البيانات التالية وسنولّد تصنيفًا أوليًا لتسهيل المراجعة.
          </p>
        </div>

        <ReportForm />
      </div>

      <aside className="space-y-6">
        <div className="glass p-6">
          <p className="card-title">ملخص المساعد</p>
          <p className="mt-3 text-sm text-slate-300">
            بعد الإرسال سيتم توليد ملخص وتصنيف مبدئي مثل: "ابتزاز رقمي - مستوى خطورة مرتفع".
          </p>
          <div className="mt-4 rounded-xl bg-white/10 p-4 text-sm text-slate-200">
            تم رصد رابط مشبوه ورسالة تطلب تحويل مبلغ مالي.
          </div>
        </div>

        {guidanceCards.map((card) => (
          <div key={card.title} className="glass p-6">
            <p className="card-title">{card.title}</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {card.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
    </div>
  );
}
