"use client";

import FormError, { FormErrorType } from "@/components/FormError";
import AppLink from "@/components/Link";
import Modal from "@/components/Modal";
import Nav from "@/components/Nat";
import clientApi from "@/lib/api/clien";
import ProjectType from "@/types/project";
import { EditIcon } from "lucide-react";
import { use, useState } from "react";
import { useTranslations } from "use-intl";


interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: unknown) => void;
    project: ProjectType | null;
}

function ProjectModal({ isOpen, onClose, onCreate, project }: ProjectModalProps) {
    const [formData, setFormData] = useState<Record<string, unknown> | null>(project ? { ...project } : null);
    const [error, setError] = useState<FormErrorType | null>(null);

    const t = useTranslations('admin.projects');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const res = await clientApi(`/api/admin/projects`, {
            method: project?.id ? "PUT" : "POST",
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        setError(data);

        if (!res.ok) {
            return;
        } else {
            onCreate?.(data);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">{formData?.id ? `${t('update')} ${formData?.title}` : t('new_project')}</h2>
            <FormError error={error} />
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={formData?.id as string || ""} />
                <input
                    className="border border-gray-300 p-2 rounded"
                    placeholder={t('title')}
                    value={formData?.title as string || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        type="button"
                        className="px-4 py-2 rounded border border-gray-300"
                        onClick={onClose}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        {formData?.id ? t('update') : t('create')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default function ProjectsClient({ projects }: { projects: ProjectType[] }) {
    const [projectModal, setProjectModal] = useState<ProjectType | null>(null);
    const [projectsState, setProjectsState] = useState<ProjectType[]>(projects);

    const onUpdate = async () => {
        setProjectModal(null);
        const res = await clientApi(`/api/admin/projects`, {
            method: "GET",
        });

        const data = await res.json();
        setProjectsState(data?.data);
    };

    const t = useTranslations('admin.projects');
    return (
        <div>
            <Nav title={t('projects')}>
                <button onClick={() => setProjectModal({ id: "" } as ProjectType)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    {t('new_project')}
                </button>
            </Nav>

            <div className="p-6">
                <div className="grid grid-col-1 md:grid-cols-4 gap-4">
                    {projectsState.map(project => (
                        <div
                            key={project.id}
                            className="flex justify-between border border-gray-200 bg-white rounded-xl p-4 hover:shadow cursor-pointer"
                        >
                            <AppLink href={`/admin/projects/${project.id}`}>{project.title}</AppLink>
                            <button onClick={() => setProjectModal(project)} className="">
                                <EditIcon className="text-orange-500 inline-block w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                {projectModal && <ProjectModal
                    key={projectModal?.id}
                    isOpen={!!projectModal}
                    project={projectModal}
                    onClose={() => setProjectModal(null)}
                    onCreate={onUpdate}
                />}
            </div>
        </div>
    );
}
