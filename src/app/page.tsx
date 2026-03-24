import Link from "next/link";

const highlights = [
  {
    title: "تجميع البلاغات بسرعة",
    description: "واجهة عربية واضحة تساعد المواطنين على تقديم البلاغ خلال دقائق."
  },
  {
    title: "رفع الأدلة",
    description: "إرفاق لقطات الشاشة والرسائل والملفات لدعم البلاغ."
  },
  {
    title: "تصنيف مبدئي",
    description: "تحليل أولي بالذكاء الاصطناعي لتوجيه المراجعة البشرية."
  }
];

const steps = [
  {
    title: "أدخل التفاصيل",
    description: "اكتب وصفًا مبسطًا للحادث مع الوقت والقناة المستخدمة."
  },
  {
    title: "ارفع الأدلة",
    description: "أضف الملفات أو الروابط أو أرقام التواصل المرتبطة بالحالة."
  },
  {
    title: "استلم تأكيدًا",
    description: "يحصل البلاغ على رقم مرجعي وتصنيف أولي للمراجعة."
  }
];

const stats = [
  { label: "بلاغات اليوم (تجريبي)", value: "48" },
  { label: "بلاغات عالية الخطورة", value: "12" },
  { label: "متوسط وقت الاستجابة", value: "9 دقائق" }
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <div className="badge">تصنيف أولي بالذكاء الاصطناعي</div>
          <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
            منصة تجريبية لتبسيط بلاغات الجرائم الإلكترونية في مصر
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            هدفنا بناء تجربة سلسة وآمنة تساعد على تنظيم البلاغات، وفرزها مبدئيًا، وتقديم دعم
            فوري للمبلغين.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/report"
              className="rounded-xl bg-sand px-6 py-3 text-sm font-semibold text-midnight shadow-glow transition hover:brightness-110"
            >
              قدّم بلاغ الآن
            </Link>
            <Link
              href="/admin"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30"
            >
              عرض لوحة الإدارة
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="glass px-4 py-4">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong p-6">
          <div className="flex items-center justify-between">
            <p className="card-title">مساعد الإرشاد الفوري</p>
            <span className="text-xs text-sand">تجريبي</span>
          </div>
          <div className="mt-6 space-y-4 text-sm">
            <div className="rounded-2xl bg-white/10 p-4 text-slate-200">
              مرحبًا! صف لي المشكلة وسأقترح النوع المناسب للبلاغ.
            </div>
            <div className="rounded-2xl bg-slate-900/60 p-4 text-slate-300">
              تعرضت لرسالة تطلب تحويل أموال وإلا سيتم نشر صوري.
            </div>
            <div className="rounded-2xl bg-white/10 p-4 text-slate-200">
              يبدو ذلك ابتزازًا رقميًا. هل لديك أرقام أو روابط يمكن إضافتها؟
            </div>
          </div>
          <button className="mt-6 w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/30">
            ابدأ محادثة جديدة
          </button>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="section-title">لماذا هذه المنصة؟</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="glass p-6">
              <p className="card-title">{item.title}</p>
              <p className="mt-3 text-sm text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <h2 className="section-title">رحلة البلاغ في ثلاث خطوات</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="glass flex gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-base font-semibold text-sand">
                  {index + 1}
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{step.title}</p>
                  <p className="mt-2 text-sm text-slate-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-6">
          <p className="card-title">ملاحظات مهمة قبل الإرسال</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>تأكد من إزالة البيانات الحساسة غير المرتبطة بالبلاغ.</li>
            <li>اكتب تفاصيل زمنية واضحة لسهولة التحقق.</li>
            <li>احتفظ بنسخة من الأدلة لديك دائمًا.</li>
          </ul>
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            هذه المنصة لا تمثل جهة رسمية، ويتم استخدام بيانات تجريبية فقط.
          </div>
        </div>
      </section>

      <section className="glass-strong p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">جاهز لتقديم بلاغك؟</h2>
        <p className="mt-3 text-sm text-slate-300">
          ابدأ الآن وسنقوم بتوليد تصنيف أولي يساعد فريق المراجعة.
        </p>
        <Link
          href="/report"
          className="mt-6 inline-flex rounded-xl bg-oasis px-6 py-3 text-sm font-semibold text-midnight shadow-glow transition hover:brightness-110"
        >
          ابدأ تقديم البلاغ
        </Link>
      </section>
    </div>
  );
}
