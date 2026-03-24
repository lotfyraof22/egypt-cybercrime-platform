import type { Metadata } from "next";
import Link from "next/link";
import { Cairo } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "منصة بلاغات الجرائم الإلكترونية - نموذج تجريبي",
  description: "منصة تجريبية لتقديم بلاغات الجرائم الإلكترونية في مصر مع تصنيف مبدئي بالذكاء الاصطناعي."
};

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/report", label: "قدّم بلاغ" },
  { href: "/admin", label: "لوحة الإدارة" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-midnight text-slate-100`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.25),_transparent_45%),radial-gradient(circle_at_20%_80%,_rgba(245,208,140,0.15),_transparent_50%)]" />
          <div className="relative">
            <header className="border-b border-white/10">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold text-sand shadow-glow">
                    ص
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">منصة البلاغات الإلكترونية</p>
                    <p className="text-xs text-slate-400">نموذج تجريبي غير رسمي</p>
                  </div>
                </div>
                <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="badge">بيئة تجريبية</div>
              </div>
            </header>

            <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">{children}</main>

            <footer className="border-t border-white/10">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                <p>هذا النموذج للتجربة التقنية فقط ولا يمثل جهة رسمية.</p>
                <div className="flex items-center gap-4">
                  <Link href="/report" className="hover:text-white">
                    قدّم بلاغ
                  </Link>
                  <Link href="/admin" className="hover:text-white">
                    لوحة الإدارة
                  </Link>
                </div>
              </div>
            </footer>
          </div>
          <ChatWidget />
        </div>
      </body>
    </html>
  );
}
