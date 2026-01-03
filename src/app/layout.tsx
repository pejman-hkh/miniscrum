import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import "./globals.css";
import ClientLayout from "./clientLayout";

export const metadata: Metadata = {
  title: "MiniScrum",
  description: "A lightweight Scrum / Kanban board built with Next.js, Prisma, and Docker. Designed for simple project and task management with drag & drop support.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations();

  return (
    <html lang="en">
      <body
        dir={t("direction")}
        className={`antialiased`}
      >
        <main className="bg-gray-100 min-h-screen">
          <NextIntlClientProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
