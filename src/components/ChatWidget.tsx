"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

type ChatResponse = {
  ok: boolean;
  reply?: string;
  provider?: "openai" | "mock";
  error?: string;
};

const initialMessage: Message = {
  role: "assistant",
  content: "أهلًا! أنا مساعد إرشادي غير رسمي. قول لي باختصار حصل إيه وسأساعدك بخطوات آمنة."
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.slice(-6)
        })
      });
      const payload = (await response.json()) as ChatResponse;

      if (!payload.ok || !payload.reply) {
        throw new Error(payload.error ?? "تعذر الحصول على رد.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: payload.reply ?? "" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "آسف، حصلت مشكلة في الرد. ممكن تكرر سؤالك بشكل أبسط؟"
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="glass-strong w-80 overflow-hidden border border-white/15 shadow-glow">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">مساعد الإرشاد</p>
              <p className="text-[11px] text-slate-400">إجابات توعوية غير رسمية</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-300 hover:text-white"
              aria-label="إغلاق"
            >
              إغلاق
            </button>
          </div>

          <div ref={listRef} className="max-h-80 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed md:text-sm ${
                    message.role === "user"
                      ? "bg-white/10 text-slate-100"
                      : "bg-oasis/20 text-slate-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isSending && <p className="text-xs text-slate-400">جارٍ كتابة الرد...</p>}
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="اكتب سؤالك هنا"
                className="input h-10 text-xs"
              />
              <button
                onClick={sendMessage}
                disabled={isSending}
                className="rounded-xl bg-sand px-3 text-xs font-semibold text-midnight disabled:opacity-60"
              >
                إرسال
              </button>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              لا تشارك كلمات مرور أو بيانات دفع.
            </p>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-oasis px-4 py-3 text-xs font-semibold text-midnight shadow-glow"
        >
          افتح المساعد
        </button>
      )}
    </div>
  );
}
