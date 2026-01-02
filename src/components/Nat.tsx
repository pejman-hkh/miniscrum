"use client";

export default function Nav({ title, children }: { title?: string, children?: React.ReactNode }) {
    return (
        <nav className="bg-white border-b border-gray-200 p-4 mb-4">
            <div className="mt-2  flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {children}
                </div>
                <div>
                    <button onClick={async () => {
                        localStorage.removeItem("token");
                        await fetch("/api/auth/logout", { method: "POST" });
                        window.location.href = "/login";
                    }} className="ml-4 bg-red-500 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}