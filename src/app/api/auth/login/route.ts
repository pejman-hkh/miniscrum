import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return Response.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
        return Response.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await signToken({ id: user.id });
    const cookie = await cookies();
    cookie.set("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });

    return Response.json({ message: "Login successfully", data: { token } });
}
