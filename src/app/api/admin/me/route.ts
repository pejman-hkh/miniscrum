import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    //check user and return user info
    const userId = await getUser(req);

    if (!userId) {
        return Response.json({ error: ["Unauthorized"] }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
        }
    });

    if (!user) {
        return Response.json({ error: ["User not found"] }, { status: 404 });
    }

    return Response.json({ message: 'User info', data: user });
}