import { prisma } from "@/lib/db";
import ProjectsClient from "./client";
import ProjectType from "@/types/project";

export default async function ProjectsPage() {

    const projects = await prisma.project.findMany();

    return (
        <ProjectsClient projects={projects as unknown as ProjectType[]} />
    );
}
