import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const { email, password, name } = await req.json();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
        return Response.json({ error: "This user exists" }, { status: 400 });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, password: hash, name }
    });

    const token = await signToken({ id: user.id });

    const cookie = await cookies()
    cookie.set("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });

    return Response.json({ message: "Register successfully", data: { token } });
}
