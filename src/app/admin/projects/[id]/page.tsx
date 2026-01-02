import { prisma } from "@/lib/db";
import ProjectType from "@/types/project";
import ProjectBoard from "./client";
import UserType from "@/types/user";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
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

    const users = await prisma.user.findMany();

    return <ProjectBoard project={project as unknown as ProjectType} users={users as unknown as UserType[]} />;
}