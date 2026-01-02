import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id: id },
        include: {
            tasks: {
                orderBy: { sortOrder: 'asc' },
                include: {
                    user: true
                }
            },
            user: true
        }
    });

    if (!project) {
        return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ data: project }));
}