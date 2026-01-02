import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
    const projects = await prisma.project.findMany();
    return Response.json({ data: projects });
}

export async function POST(req: Request) {
    const { title } = await req.json();
    const userId = await getUser(req);

    if (!title) {
        return Response.json(
            { error: ["Title is required"] },
            { status: 400 }
        );
    }

    const project = await prisma.project.create({
        data: {
            title,
            user: {
                connect: { id: userId }
            }
        }
    });

    return Response.json({ message: 'Added successfully', data: project });
}


export async function PUT(req: Request) {
    const { title, id } = await req.json();

    if (!title) {
        return Response.json(
            { error: ["Title is required"] },
            { status: 400 }
        );
    }

    const project = await prisma.project.update({
        where: { id },
        data: { title }
    });

    return Response.json({ message: 'Updated successfully', data: project });
}