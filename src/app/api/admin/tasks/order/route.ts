import { TaskStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db";

export async function PUT(req: Request) {
    try {
        const payload: { id: string; status: string; sortOrder: number }[] = await req.json();

        await prisma.$transaction(
            payload.map(t =>
                prisma.task.update({
                    where: { id: t.id },
                    data: { status: t.status as keyof typeof TaskStatus, sortOrder: t.sortOrder }
                })
            )
        );

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Could not update tasks" }), { status: 500 });
    }
}