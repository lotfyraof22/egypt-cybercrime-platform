"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitReport, type FormState } from "@/app/report/actions";

const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "الشرقية",
  "الغربية",
  "المنوفية",
  "القليوبية",
  "كفر الشيخ",
  "البحيرة",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "شمال سيناء",
  "جنوب سيناء",
  "البحر الأحمر",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "الوادي الجديد",
  "مطروح"
];

const incidentTypes = [
  "ابتزاز رقمي",
  "احتيال / نصب",
  "اختراق حساب",
  "انتحال شخصية",
  "رابط مشبوه",
  "أخرى"
];

const initialState: FormState = { errors: {} };

const fieldClass = (hasError: boolean) =>
  `input ${
    hasError ? "border-ember/60 ring-2 ring-ember/50" : "border-white/10"
  }`;

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="error-text">{message}</p>;
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-oasis px-6 py-3 text-sm font-semibold text-midnight shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "جارٍ الإرسال..." : "إرسال البلاغ"}
    </button>
  );
};

export default function ReportForm() {
  const [state, formAction] = useFormState(submitReport, initialState);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="glass space-y-6 p-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="label" htmlFor="fullName">
            الاسم بالكامل
          </label>
          <input
            id="fullName"
            name="fullName"
            className={fieldClass(!!state.errors.fullName)}
            placeholder="الاسم كما يظهر في البطاقة"
            required
          />
          <FieldError message={state.errors.fullName} />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="phone">
            رقم الهاتف
          </label>
          <input
            id="phone"
            name="phone"
            className={fieldClass(!!state.errors.phone)}
            placeholder="مثال: 01012345678"
            required
          />
          <FieldError message={state.errors.phone} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="label" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={fieldClass(!!state.errors.email)}
            placeholder="name@email.com"
            required
          />
          <FieldError message={state.errors.email} />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="governorate">
            المحافظة
          </label>
          <select
            id="governorate"
            name="governorate"
            className={fieldClass(!!state.errors.governorate)}
            defaultValue=""
            required
          >
            <option value="" disabled className="text-midnight">
              اختر المحافظة
            </option>
            {governorates.map((gov) => (
              <option key={gov} value={gov} className="text-midnight">
                {gov}
              </option>
            ))}
          </select>
          <FieldError message={state.errors.governorate} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="label" htmlFor="incidentType">
            نوع البلاغ
          </label>
          <select
            id="incidentType"
            name="incidentType"
            className={fieldClass(!!state.errors.incidentType)}
            defaultValue=""
            required
          >
            <option value="" disabled className="text-midnight">
              اختر نوع البلاغ
            </option>
            {incidentTypes.map((type) => (
              <option key={type} value={type} className="text-midnight">
                {type}
              </option>
            ))}
          </select>
          <FieldError message={state.errors.incidentType} />
        </div>
        <div className="space-y-2">
          <label className="label" htmlFor="incidentDate">
            تاريخ الحادث
          </label>
          <input
            id="incidentDate"
            name="incidentDate"
            type="date"
            className={fieldClass(!!state.errors.incidentDate)}
            required
          />
          <FieldError message={state.errors.incidentDate} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="label" htmlFor="incidentDescription">
          وصف الحادث
        </label>
        <textarea
          id="incidentDescription"
          name="incidentDescription"
          rows={6}
          className={fieldClass(!!state.errors.incidentDescription)}
          placeholder="اكتب ملخصًا واضحًا لما حدث مع ذكر الرسائل أو الحسابات أو الطلبات المالية."
          required
        />
        <FieldError message={state.errors.incidentDescription} />
      </div>

      <div className="space-y-2">
        <label className="label" htmlFor="evidence">
          رفع الأدلة (صور/ملفات)
        </label>
        <input
          id="evidence"
          name="evidence"
          type="file"
          multiple
          className="input file:text-slate-200"
        />
        <p className="text-xs text-slate-400">اختياري: يمكنك رفع أكثر من ملف.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <SubmitButton />
        <button
          type="reset"
          className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30"
        >
          تفريغ الحقول
        </button>
      </div>
    </form>
  );
}
