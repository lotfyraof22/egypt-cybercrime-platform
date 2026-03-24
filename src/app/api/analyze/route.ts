import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { AiAnalysis, AiIncidentType } from "@/app/lib/aiTypes";

export const runtime = "nodejs";

const incidentTypes: AiIncidentType[] = [
  "blackmail",
  "scam",
  "hacked account",
  "impersonation",
  "suspicious link",
  "other"
];

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    incident_type: {
      type: "string",
      enum: incidentTypes
    },
    summary: {
      type: "string"
    },
    risk: {
      type: "string",
      enum: ["low", "medium", "high"]
    },
    entities: {
      type: "object",
      additionalProperties: false,
      properties: {
        phones: {
          type: "array",
          items: { type: "string" }
        },
        emails: {
          type: "array",
          items: { type: "string" }
        },
        urls: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["phones", "emails", "urls"]
    }
  },
  required: ["incident_type", "summary", "risk", "entities"]
};

const systemPrompt = `أنت مساعد فرز أولي لبلاغات الجرائم الإلكترونية.
المطلوب: إرجاع JSON مطابق تمامًا للمخطط المحدد.
القواعد:
- صَنِّف الحادث إلى واحدة من القيم: blackmail, scam, hacked account, impersonation, suspicious link, other.
- استخرج أرقام الهواتف والبريد الإلكتروني والروابط من الوصف فقط.
- ألخّص في جملة أو جملتين بالعربية الفصحى المختصرة.
- حدّد مستوى الخطورة: low / medium / high.
- أزل التكرارات في القوائم.
- لا تضف أي مفاتيح إضافية أو نص خارج JSON.`;

const normalizeList = (items: string[]) => Array.from(new Set(items.map((item) => item.trim()))).filter(Boolean);

const extractWith = (pattern: RegExp, text: string) => normalizeList(text.match(pattern) ?? []);

const basicAnalyze = (description: string): AiAnalysis => {
  const text = description.toLowerCase();
  const hasAny = (keywords: string[]) => keywords.some((word) => text.includes(word));

  let incidentType: AiIncidentType = "other";

  if (hasAny(["ابتزاز", "تهديد", "فضح", "صور", "نشر"])) {
    incidentType = "blackmail";
  } else if (hasAny(["نصب", "احتيال", "تحويل", "مبلغ", "فلوس", "محفظة", "جائزة"])) {
    incidentType = "scam";
  } else if (hasAny(["اختراق", "هاكر", "هاك", "سرقة حساب", "حسابي اتسرق"])) {
    incidentType = "hacked account";
  } else if (hasAny(["انتحال", "منتحل", "شخصية", "بيقلد", "اسم مزيف"])) {
    incidentType = "impersonation";
  } else if (hasAny(["رابط", "لينك", "مشبوه", "phishing"])) {
    incidentType = "suspicious link";
  }

  const risk = incidentType === "blackmail" || incidentType === "scam" ? "high" : incidentType === "suspicious link" ? "low" : "medium";

  const phones = extractWith(/(\+?\d[\d\s\-()]{6,}\d)/g, description);
  const emails = extractWith(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, description);
  const urls = extractWith(/https?:\/\/[^\s]+|www\.[^\s]+/gi, description);

  const trimmed = description.replace(/\s+/g, " ").trim();
  const shortText = trimmed.length > 140 ? `${trimmed.slice(0, 140)}...` : trimmed;

  return {
    incident_type: incidentType,
    risk,
    summary: `بلاغ عن حادث إلكتروني. ملخص: ${shortText || "لم يتم توفير تفاصيل كافية."}`,
    entities: {
      phones,
      emails,
      urls
    }
  };
};

export async function POST(request: Request) {
  let body: { description?: unknown } = {};

  try {
    body = (await request.json()) as { description?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "البيانات المرسلة غير صحيحة." }, { status: 400 });
  }

  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!description) {
    return NextResponse.json({ ok: false, error: "وصف الحادث مطلوب للتحليل." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const mock = basicAnalyze(description);
    return NextResponse.json({ ok: true, provider: "mock", data: mock });
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "o3-mini",
      temperature: 0,
      max_tokens: 300,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "cybercrime_report_analysis",
          schema: analysisSchema,
          strict: true
        }
      },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `وصف الحادث:\n${description}`
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response");
    }

    const parsed = JSON.parse(content) as AiAnalysis;

    return NextResponse.json({ ok: true, provider: "openai", data: parsed });
  } catch (error) {
    const mock = basicAnalyze(description);
    return NextResponse.json({
      ok: true,
      provider: "mock",
      data: mock,
      error: "تعذر الاتصال بخدمة التحليل، تم استخدام تحليل تجريبي."
    });
  }
}
