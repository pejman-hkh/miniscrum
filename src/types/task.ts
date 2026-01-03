import { TaskStatus } from "@/generated/prisma/enums";
import ProjectType from "./project";
import UserType from "./user";

export interface TaskType {
    id: string;
    title: string;
    description?: string;
    sortOrder: number;
    status: TaskStatus;
    project: ProjectType;
    user?: UserType;
    userId: string;
    projectId: string;
    createdAt: string;
}