"use client";

import AppLink from "@/components/Link";
import Nav from "@/components/Nat";
import ProjectType from "@/types/project";
import UserType from "@/types/user";
import dynamic from "next/dynamic";

const Board = dynamic(() => import("@/components/Board"), {
    ssr: false,
});

export default function ProjectBoard({ project, users }: { project: ProjectType, users: UserType[] }) {
    return (
        <div>
            <Nav title={`${project.title} - Board`}>
                <AppLink href="/admin/projects" className="bg-blue-500 text-white px-4 py-2 rounded">
                    All Projects
                </AppLink>
            </Nav>

            <div>
                <Board project={project} users={users} />
            </div>
        </div>
    );
}
