"use client";
import DataContext from "@/context/DataContext";
import clientApi from "@/lib/api/clien";
import UserType from "@/types/user";
import { useEffect, useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    useEffect(() => {
        async function fetchUser() {
            const res = await clientApi('/api/admin/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.data);
            }
        }
        fetchUser();
    }, []);

    return (
        <DataContext value={{ user, setUser }}>
            {children}
        </DataContext>
    );
}