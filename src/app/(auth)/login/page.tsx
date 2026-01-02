// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLink from "@/components/Link";
import FormError, { FormErrorType } from "@/components/FormError";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<FormErrorType | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    setError(data);

    if (!res.ok) {
      return;
    }

    localStorage.setItem("token", data?.data.token);
    router.push("/admin/projects");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white w-[27%] border border-gray-200 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-2">Login</h1>
        <FormError error={error} />
        <form onSubmit={submit} className="space-y-4">

          <div className="flex flex-col gap-1">
            <label>Email</label>
            <input
              className="w-full border p-2 rounded border-gray-300"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>

          <div className="text-center text-sm">
            <AppLink href="/register">Register</AppLink>
          </div>
        </form>
      </div>
    </div>
  );
}
