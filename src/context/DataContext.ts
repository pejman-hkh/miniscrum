import UserType from "@/types/user";
import { createContext } from "react";

export interface DataContextType {
    user: UserType | null;
    setUser?: (user: UserType | null) => void;
}

const DataContext = createContext<DataContextType>({ user: null });

export default DataContext;