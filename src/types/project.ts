import { TaskType } from "./task";
import UserType from "./user";

export interface ProjectType {
    id: string;
    title?: string;
    tasks: TaskType[];
    user?: UserType;
    userId: string;
    createdAt: Date;
};

export default ProjectType;
