"use client";

import { useEffect, useState } from "react";
import type { AiAnalysis, AiAnalysisResponse, AiIncidentType, AiRisk } from "@/app/lib/aiTypes";

const typeLabels: Record<AiIncidentType, string> = {
  blackmail: "ابتزاز رقمي",
  scam: "احتيال / نصب",
  "hacked account": "اختراق حساب",
  impersonation: "انتحال شخصية",
  "suspicious link": "رابط مشبوه",
  other: "أخرى"
};

const riskLabels: Record<AiRisk, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع"
};

type Props = {
  description: string;
};

type ViewState =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: AiAnalysis; provider?: "openai" | "mock" };

export default function AiAnalysis({ description }: Props) {
  const [state, setState] = useState<ViewState>({ status: "idle" });

  useEffect(() => {
    if (!description) return;

    let isActive = true;
    setState({ status: "loading" });

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description })
    })
      .then((response) => response.json())
      .then((payload: AiAnalysisResponse) => {
        if (!isActive) return;
        if (!payload.ok || !payload.data) {
          setState({ status: "error", message: payload.error ?? "فشل التحليل." });
          return;
        }
        setState({ status: "success", data: payload.data, provider: payload.provider });
      })
      .catch(() => {
        if (!isActive) return;
        setState({ status: "error", message: "تعذر الاتصال بخدمة التحليل." });
      });

    return () => {
      isActive = false;
    };
  }, [description]);

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="glass p-6">
        <p className="card-title">تحليل الذكاء الاصطناعي</p>
        <p className="mt-3 text-sm text-slate-300">جارٍ تجهيز التحليل...</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="glass p-6">
        <p className="card-title">تحليل الذكاء الاصطناعي</p>
        <p className="mt-3 text-sm text-ember">{state.message}</p>
      </div>
    );
  }

  const { data, provider } = state;

  return (
    <div className="glass p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="card-title">تحليل الذكاء الاصطناعي</p>
        {provider === "mock" && <span className="badge">تحليل تجريبي</span>}
      </div>
      <p className="mt-3 text-sm text-slate-300">{data.summary}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-sand">
          التصنيف: {typeLabels[data.incident_type]}
        </span>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-ember">
          الخطورة: {riskLabels[data.risk]}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-400">أرقام هواتف</p>
          {data.entities.phones.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">لا يوجد</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-200">
              {data.entities.phones.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-xs text-slate-400">بريد إلكتروني</p>
          {data.entities.emails.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">لا يوجد</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-200">
              {data.entities.emails.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-xs text-slate-400">روابط</p>
          {data.entities.urls.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">لا يوجد</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-slate-200 break-words">
              {data.entities.urls.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
