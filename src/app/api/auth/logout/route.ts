import { NextResponse } from "next/server";

export function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "lax",
    });

    return response;
}