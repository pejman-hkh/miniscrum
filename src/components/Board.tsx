"use client";

import FormError, { FormErrorType } from "@/components/FormError";
import Modal from "@/components/Modal";
import DataContext, { DataContextType } from "@/context/DataContext";
import clientApi from "@/lib/api/clien";
import ProjectType from "@/types/project";
import { TaskType } from "@/types/task";
import UserType from "@/types/user";
import {
    DndContext,
    DragEndEvent,
    rectIntersection,
    useDroppable
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useState } from "react";

const COLUMNS = [
    "BACKLOG",
    "TODO",
    "IN_PROGRESS",
    "DONE",
    "CANCEL"
] as const;

function TaskModal({ isOpen, onClose, onCreate, task, users }: { isOpen: boolean, onClose: () => void, onCreate: (task: TaskType) => void, task: TaskType | null, users: UserType[] }) {
    const [formData, setFormData] = useState<Record<string, unknown> | null>(task ? { ...task } : null);
    const [error, setError] = useState<FormErrorType | null>(null);

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();
        setError(null);
        //get token from cookies
        const token = localStorage.getItem("token");

        if (!token) {
            setError({ error: "Unauthorized" });
            return;
        }

        const res = await clientApi(`/api/admin/tasks`, {
            method: task?.id ? "PUT" : "POST",
            body: JSON.stringify({ ...task, ...formData })
        });

        const data = await res.json();

        setError(data);

        if (!res.ok) {
            return;
        } else {
            onCreate?.(data);
        }
    }

    const t = useTranslations('admin.projects.board');

    return (
        <Modal size={12} isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-bold mb-4">{formData?.id ? `${t('update')} ${formData?.title}` : t('new_task')}</h2>
            <FormError error={error} />
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    className="border border-gray-300 p-2 rounded"
                    placeholder={t('title')}
                    value={formData?.title as string || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    autoFocus
                />

                <textarea
                    value={formData?.description as string || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border border-gray-300 p-2 rounded h-50"
                    placeholder={t('description')}
                />

                <select
                    value={formData?.userId as string || ""}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="border border-gray-300 p-2 rounded">
                    <option>{t('to_user')}</option>
                    {users?.map((user) => <option key={user?.id} value={user?.id}>{user?.name}</option>)}
                </select>
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
                        {task?.id ? t('update') : t('create')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function TaskCard({ task, onEdit, onDelete }: { task: TaskType, onEdit: () => void, onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    const t = useTranslations('admin.projects.board');

    console.log("Rendering TaskCard for task:", task);
    const context = useContext(DataContext) as DataContextType;
    console.log("Context in TaskCard:", context);
    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="bg-gray-100 border border-gray-300 rounded-lg p-2 mb-2 cursor-grab flex justify-between items-center"
        >
            <div>
                {task.title}
                {task.description && <div className="text-sm text-gray-600 mt-1">{task.description}</div>}

                {task?.user?.name && <div className={`text-xs text-gray-500 mt-1 ${(context?.user?.id === task.userId ? '!text-green-500' : '')}`}>{t('assigned_to')} {task.user.name}</div>}
            </div>
            <div>
                <button className="me-2" onClick={onEdit} onPointerDown={(e) => e.stopPropagation()}>
                    <EditIcon className="text-orange-500 inline-block w-4 h-4" />
                </button>
                <button onClick={onDelete} onPointerDown={(e) => e.stopPropagation()}>
                    <Trash2Icon className="text-red-500 inline-block w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function BoardColumn({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="bg-white border-gray-100 rounded-xl p-3">
            {children}
        </div>
    );
}

export default function ProjectBoard({ project, users }: { project: ProjectType, users: UserType[] }) {

    const [taskModal, setTaskModal] = useState<TaskType | null>(null);

    const [board, setBoard] = useState(() => {
        const grouped: Record<string, TaskType[]> = {};
        COLUMNS.forEach(c => (grouped[c] = []));
        project.tasks.forEach((t) => grouped[t.status].push(t));
        return grouped;
    });

    function findColumn(taskId: string) {
        return COLUMNS.find(col =>
            board[col].some(t => t.id === taskId)
        );
    }

    function onDragOver(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const from = findColumn(active.id as string);

        const to =
            COLUMNS.includes(over.id as typeof COLUMNS[number])
                ? (over.id as typeof COLUMNS[number])
                : findColumn(over.id as string);

        if (!from || !to || from === to) return;

        setBoard(prev => {
            const activeItem = prev[from].find(i => i.id === active.id);
            if (!activeItem) return prev;

            return {
                ...prev,
                [from]: prev[from].filter(i => i.id !== active.id),
                [to]: [...prev[to], { ...activeItem, status: to }]
            };
        });
    }

    async function onDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const from = findColumn(active.id as string);
        const to = COLUMNS.includes(over.id as typeof COLUMNS[number])
            ? (over.id as typeof COLUMNS[number])
            : findColumn(over.id as string);

        if (!from || !to) return;

        if (from === to) {
            const items = board[from];
            const oldIndex = items.findIndex(i => i.id === active.id);
            const newIndex = items.findIndex(i => i.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);

            setBoard(prev => ({ ...prev, [from]: newItems }));

            const payload = newItems.map((t, index) => ({
                id: t.id,
                status: from,
                sortOrder: index
            }));
            await saveOrderToDB(payload);
        } else {

            const fromItems = board[from].filter(i => i.id !== active.id) as TaskType[];
            const movedItem = board[from].find(i => i.id === active.id);
            const toItems = [...board[to], { ...movedItem, status: to }] as TaskType[];

            setBoard(prev => ({
                ...prev,
                [from]: fromItems,
                [to]: toItems
            }));

            const payloadFrom = fromItems.map((t, index) => ({
                id: t.id,
                status: from,
                sortOrder: index
            }));
            const payloadTo = toItems.map((t, index) => ({
                id: t.id,
                status: to,
                sortOrder: index
            }));

            await saveOrderToDB([...payloadFrom, ...payloadTo]);
        }
    }

    const saveOrderToDB = async (payload: { id: string, status: string, sortOrder: number }[]) => {
        try {
            await clientApi("/api/admin/tasks/order", {
                method: "PUT",
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error("Failed to save order:", error);
        }
    };

    const onUpdate = () => {
        clientApi(`/api/admin/projects/${project.id}`)
            .then(res => res.json())
            .then(data => {
                const grouped: Record<string, TaskType[]> = {};
                COLUMNS.forEach(c => (grouped[c] = []));
                data.data.tasks.forEach((t: TaskType) => grouped[t.status].push(t));
                setBoard(grouped);
            });
    }
    const t = useTranslations('admin.projects.board');

    const { setConfirmation } = useContext(DataContext) as DataContextType;
    return (<div>

        <DndContext
            collisionDetection={rectIntersection}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
                {COLUMNS.map(col => (
                    <BoardColumn key={col} id={col}>
                        <h3 className="font-bold mb-2 flex justify-between items-center">
                            {t(col)}
                            {col === 'BACKLOG' && <button onClick={() => setTaskModal({ projectId: project.id } as TaskType)}>
                                <PlusIcon size={16} className="text-green-500" />
                            </button>}
                        </h3>

                        <SortableContext
                            items={board[col].map(t => t.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {board[col].map(task => (
                                <TaskCard key={task.id} task={task} onEdit={() => setTaskModal(task)} onDelete={() => {
                                    setConfirmation({
                                        isOpen: true,
                                        title: t('delete_task'),
                                        message: t('delete_task_confirm'),
                                        onConfirm: async () => {
                                            await clientApi(`/api/admin/tasks`, {
                                                method: "DELETE",
                                                body: JSON.stringify({ id: task.id })
                                            });
                                            onUpdate();
                                            setConfirmation(null);
                                        },
                                        onCancel: () => {
                                            setConfirmation(null);
                                        }
                                    });
                                }} />
                            ))}
                        </SortableContext>
                    </BoardColumn>
                ))}
            </div>
        </DndContext>
        {taskModal && <TaskModal
            key={taskModal?.id}
            isOpen={!!taskModal}
            task={taskModal}
            onClose={() => setTaskModal(null)}
            onCreate={() => {
                setTaskModal(null);
                onUpdate()
            }}
            users={users}
        />}
    </div>);
}
