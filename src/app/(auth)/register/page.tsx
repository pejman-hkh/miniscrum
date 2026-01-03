// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLink from "@/components/Link";
import FormError, { FormErrorType } from "@/components/FormError";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<FormErrorType | null>(null);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        setError(data);

        if (!res.ok) {
            return;
        }

        localStorage.setItem("token", data?.data.token);
        router.push("/admin/projects");
    }

    const t = useTranslations('auth.register');
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white w-full md:w-[27%] border border-gray-200 p-6 rounded-2xl">
                <h1 className="text-2xl font-bold text-center mb-2">{t('title')}</h1>
                <h2 className="text-xl font-bold text-center mb-2">{t('register')}</h2>
                <FormError error={error} />
                <form onSubmit={submit} className="space-y-4">

                    <div className="flex flex-col gap-1">
                        <label>{t('name')}</label>
                        <input
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder={t('name')}
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>{t('email')}</label>
                        <input
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder={t('email')}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label>{t('password')}</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 p-2 rounded"
                            placeholder={t('password')}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="w-full bg-blue-500 text-white p-2 rounded">
                        {t('submit')}
                    </button>

                    <div className="text-center text-sm">
                        <AppLink href="/login">{t('login')}</AppLink>
                    </div>
                </form>
            </div>
        </div>
    );
}
