import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    const tasks = await prisma.task.findMany();
    return Response.json({ data: tasks });
}

export async function POST(req: Request) {
    //get user id from token in authorization header

    const { title, projectId, userId, description } = await req.json();
    const nuserId = userId ?? await getUser(req);

    if (!title) {
        return Response.json(
            { error: ["Title is required"] },
            { status: 400 }
        );
    }

    if (!projectId) {
        return Response.json({ error: ["Project is required"] }, { status: 400 });
    }

    const lastTask = await prisma.task.findFirst({
        where: {
            projectId: projectId,
            status: 'BACKLOG'
        },
        orderBy: {
            sortOrder: 'desc'
        }
    });

    const newSortOrder = lastTask ? lastTask.sortOrder + 1 : 0;

    const task = await prisma.task.create({
        data: {
            sortOrder: newSortOrder,
            status: 'BACKLOG',
            project: {
                connect: { id: projectId }
            },
            title,
            description: description || "",
            user: {
                connect: { id: nuserId }
            }
        }
    });

    return Response.json({ message: 'Added successfully', data: task });
}

export async function PUT(req: Request) {
    const { title, description, id, userId } = await req.json();

    if (!id) {
        return Response.json({ error: ["ID is required"] }, { status: 400 });
    }

    if (!title) {
        return Response.json(
            { error: ["Title is required"] },
            { status: 400 }
        );
    }

    const task = await prisma.task.update({
        where: { id },
        data: { title, description: description || "", user: { connect: { id: userId } } }
    });

    return Response.json({ message: 'Updated successfully', data: task });
}