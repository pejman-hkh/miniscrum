"use client";

import { useTranslations } from "next-intl";
import Lang from "./Lang";

export default function Nav({ title, children }: { title?: string, children?: React.ReactNode }) {
    const t = useTranslations('common');

    return (
        <nav className="bg-white border-b border-gray-200 p-4 mb-4">
            <div className="mt-2 flex flex-col md:flex-row gap-2 justify-between items-center">
                <div className="flex gap-4 items-center">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {children}
                </div>
                <div className="flex items-center">
                    <Lang />
                    <button onClick={async () => {
                        localStorage.removeItem("token");
                        await fetch("/api/auth/logout", { method: "POST" });
                        window.location.href = "/login";
                    }} className="ms-2 bg-red-500 text-white px-4 py-2 rounded-2xl">
                        {t('logout')}
                    </button>
                </div>
            </div>
        </nav>
    );
}