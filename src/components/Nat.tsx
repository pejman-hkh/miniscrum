"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";

export default function Nav({ title, children }: { title?: string, children?: React.ReactNode }) {
    const t = useTranslations('common');
    //change lang handler
    const changeLocale = (locale: string) => {
        document.cookie = `locale=${locale}; path=/; max-age=31536000`;
        window.location.reload();
    }

    const [lang, setLang] = useState<string>('en');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLang(
            document.cookie
                .split("; ")
                .find((row) => row.startsWith("locale="))
                ?.split("=")[1] || "en"
        );
    }, []);

    return (
        <nav className="bg-white border-b border-gray-200 p-4 mb-4">
            <div className="mt-2 flex flex-col md:flex-row gap-2 justify-between items-center">
                <div className="flex gap-4 items-center">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {children}
                </div>
                <div className="flex items-center">
                    <Dropdown
                        label={t('select_language')}
                        value={lang}
                        items={[
                            { label: t('english'), value: "en" },
                            { label: t('persian'), value: "fa" },
                        ]}
                        onChange={(value) => {
                            changeLocale(value)
                            setLang(value);
                        }}
                    />
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