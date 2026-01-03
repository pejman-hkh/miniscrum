import { ConfirmationProps } from "@/components/Confirmation";
import UserType from "@/types/user";
import { createContext } from "react";

export interface DataContextType {
    user: UserType | null;
    setUser?: (user: UserType | null) => void;
    confirmation: ConfirmationProps | null;
    setConfirmation: (confirmation: ConfirmationProps | null) => void;
}

const DataContext = createContext<DataContextType>({ user: null, confirmation: null, setConfirmation: () => { } });

export default DataContext;