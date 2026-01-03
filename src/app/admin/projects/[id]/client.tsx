"use client";

import AppLink from "@/components/Link";
import Nav from "@/components/Nav";
import ProjectType from "@/types/project";
import UserType from "@/types/user";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const Board = dynamic(() => import("@/components/Board"), {
    ssr: false,
});

export default function ProjectBoard({ project, users }: { project: ProjectType, users: UserType[] }) {
    const t = useTranslations('admin.projects.board');
    return (
        <div>
            <Nav title={`${project.title} - ${t('board')}`}>
                <AppLink href="/admin/projects" className="bg-blue-500 text-white px-4 py-2 rounded-2xl">
                    {t('back_to_projects')}
                </AppLink>
            </Nav>

            <div>
                <Board project={project} users={users} />
            </div>
        </div>
    );
}
