import Link from "next/link";

export default function AppLink({ href, children, className }: { href: string; children: React.ReactNode, className?: string }) {
    return (
        <Link href={href} className={className ?? `text-blue-500 hover:underline`}>
            {children}
        </Link>
    );
}