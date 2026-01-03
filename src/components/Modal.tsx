"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: number;
}

const widths: Record<number, string> = {
    4: "w-4/12",
    6: "w-6/12",
    8: "w-8/12",
    10: "w-10/12",
    12: "w-full",
};

export default function Modal({ isOpen, onClose, children, size = 6 }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        if (isOpen) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        if (isOpen) window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="p-2 fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="flex w-180 justify-center">
                <div
                    ref={modalRef}
                    className={`bg-white rounded-2xl p-6 ${widths[size]} shadow-lg relative`}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
