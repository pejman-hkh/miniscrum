import Modal from "./Modal";
import { useTranslations } from "next-intl";

export interface ConfirmationProps {
    isOpen: boolean;
    onCancel?: () => void;
    onConfirm?: () => void;
    title?: string;
    message?: string;
    onClose?: () => void;
}

export default function Confirmation({ isOpen, onCancel, onClose, onConfirm, title, message }: ConfirmationProps) {

    const t = useTranslations('common');

    return (<Modal isOpen={isOpen} onClose={() => onClose?.()}>
        <h2 className="text-xl mb-4">{title}</h2>
        {message}

        <div className="flex justify-center mt-4">
            <button className="w-20 bg-red-500 rounded p-2 text-white mx-2" onClick={onConfirm}>{t('yes')}</button>
            <button className="w-20 bg-gray-200 rounded p-2 mx-2" onClick={onCancel}>{t('cancel')}</button>
        </div>
    </Modal>);
}