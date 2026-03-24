import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  message?: unknown;
  history?: unknown;
};

const systemPrompt = `أنت مساعد إرشادي غير رسمي للتوعية بالسلامة الرقمية.
المطلوب: إجابات عربية أولاً (ويُفضل لهجة مصرية خفيفة)، قصيرة وهادئة.
القواعد:
- ركّز على إرشادات الأمان وحفظ الأدلة وتجنب التصعيد.
- لا تدّعي أي صفة رسمية أو قانونية أو حكومية.
- إذا لم تكن متأكدًا، اطلب تفاصيل إضافية وقدّم رسالة احتياطية.
- لا تطلب معلومات حساسة مثل كلمات المرور أو بيانات الدفع.
- اذكر خطوات عملية قابلة للتنفيذ.`;

const fallbackMessage =
  "مش قادر أحدد بدقة من الوصف الحالي. لو تقدر تقول تفاصيل أكتر عن الرسالة/الحساب/الروابط هقدر أساعدك بشكل أحسن.";

const buildMockResponse = (text: string) => {
  const input = text.toLowerCase();

  if (input.includes("ابتزاز") || input.includes("تهديد") || input.includes("صور") || input.includes("فضح")) {
    return (
      "ده غالبًا ابتزاز. أهم حاجة: ما تدفعش أي فلوس، احفظ الأدلة (سكرين شوت، روابط، أرقام)، وبلّغ عن الحساب." +
      " لو في تهديد مباشر، خليك هادي ووقّف التواصل وغيّر كلمات المرور."
    );
  }

  if (input.includes("دلوقتي") || input.includes("إيه أعمل") || input.includes("اعمل ايه")) {
    return (
      "دلوقتي: 1) احفظ الأدلة فورًا، 2) اوقف التواصل مع المرسل، 3) غيّر كلمات المرور وفَعّل التحقق بخطوتين، " +
      "4) سجّل البيانات الأساسية (وقت/منصة/حسابات)."
    );
  }

  if (input.includes("دليل") || input.includes("أدلة") || input.includes("اثبات") || input.includes("evidence")) {
    return (
      "احفظ الأدلة بصيغة واضحة: سكرين شوت للرسائل والروابط، نسخ نص الرسائل، وتسجيل التواريخ." +
      " متحذفش المحادثة قبل حفظها، وخلي نسخة احتياطية آمنة."
    );
  }

  if (
    input.includes("اختراق") ||
    input.includes("حسابي") ||
    input.includes("اتسرق") ||
    input.includes("تم اختراق") ||
    input.includes("compromise")
  ) {
    return (
      "بعد اختراق حساب: 1) غيّر كلمة المرور فورًا، 2) فعل 2FA، 3) راجع الأجهزة والجلسات النشطة وسجل الخروج منها، " +
      "4) بلغ جهات الدعم للمنصة، 5) احذر من روابط استعادة مزيفة."
    );
  }

  if (input.includes("احتيال") || input.includes("نصب") || input.includes("فلوس") || input.includes("تحويل")) {
    return (
      "ده ممكن يكون احتيال. تجنب أي تحويلات مالية، واحفظ الأدلة، وتأكد من مصدر الرسالة." +
      " لو فيه روابط دفع، ما تفتحهاش واحتفظ بالرابط للتوثيق."
    );
  }

  return fallbackMessage;
};

export async function POST(request: Request) {
  let body: ChatRequest = {};

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "البيانات المرسلة غير صحيحة." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ ok: false, error: "الرسالة مطلوبة." }, { status: 400 });
  }

  const historyRaw = Array.isArray(body.history) ? body.history : [];
  const history = historyRaw
    .filter((item) =>
      item &&
      typeof item === "object" &&
      (item as ChatMessage).content &&
      (item as ChatMessage).role
    )
    .map((item) => ({
      role: (item as ChatMessage).role,
      content: String((item as ChatMessage).content)
    }))
    .slice(-6);

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_CHAT_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({ ok: true, provider: "mock", reply: buildMockResponse(message) });
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model,
      temperature: 0,
      max_tokens: 180,
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("Empty reply");
    }

    return NextResponse.json({ ok: true, provider: "openai", reply });
  } catch {
    return NextResponse.json({ ok: true, provider: "mock", reply: buildMockResponse(message) });
  }
}
