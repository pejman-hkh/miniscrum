"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownItem {
    label: string;
    value: string;
}

export default function Dropdown({
    label = "انتخاب کنید",
    items,
    value,
    onChange,
}: {
    label?: string;
    items: DropdownItem[];
    value?: string;
    onChange?: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = items.find((i) => i.value === value) || null;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
            >
                <span>{selected ? selected.label : label}</span>
                <svg
                    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <ul className="absolute z-10 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow">
                    {items.map((item) => (
                        <li
                            key={item.value}
                            onClick={() => {
                                setOpen(false);
                                onChange?.(item.value);
                            }}
                            className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${item.value === value ? "bg-gray-100 font-medium" : ""
                                }`}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}