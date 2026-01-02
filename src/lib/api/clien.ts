"use client";

export default function clientApi(url: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers ?? {}),
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
    });
}