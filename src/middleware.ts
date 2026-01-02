import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

const response = (req: Request) => {
    const url = new URL(req.url);
    const path = url.pathname;
    // if start with /api return json response
    if (path.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
        // else redirect to login page
        return NextResponse.redirect(new URL("/login", req.url));
    }
};

export async function middleware(req: Request) {
    // if request is /api check authorization header
    //get path from url
    const url = new URL(req.url);
    const path = url.pathname;
    if (path.startsWith("/api/")) {
        const auth = req.headers.get("authorization");
        if (!auth) return response(req);

        const token = auth.replace("Bearer ", "");

        try {
            await verifyToken(token);
            return NextResponse.next();
        } catch {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    } else {
        // else check cookie
        const cookie = req.headers.get("cookie");
        if (!cookie) return response(req);

        const match = cookie.match(/token=([^;]+)/);
        if (!match) return response(req);

        const token = match[1];
        try {
            await verifyToken(token);
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"]
};