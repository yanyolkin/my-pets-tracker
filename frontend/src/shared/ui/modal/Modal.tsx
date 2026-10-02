import {
    useEffect,
    useRef,
    type ChangeEvent,
    type ReactNode,
    type MouseEvent,
} from "react";
import styles from "./Modal.module.css";

interface ModalProps {
    isOpen: boolean;
    close: () => void;
    children: ReactNode;
}

export const Modal = ({ isOpen, close, children }: ModalProps) => {
    const dialog = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if (isOpen) {
            dialog.current?.showModal();
        } else {
            dialog.current?.close();
        }
    }, [isOpen]);
    const handleCloseDialog = (e: ChangeEvent<HTMLDialogElement>) => {
        e.preventDefault();
        close();
    };
    const handleClickOverlay = (e: MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };
    return (
        <dialog
            ref={dialog}
            onCancel={handleCloseDialog}
            onClick={handleClickOverlay}
            className={styles.dialog}
            data-testid="modal-container"
        >
            <div className={styles.content}>
                <button className={styles.close} onClick={close}>
                    <span></span>
                    <span></span>
                </button>
                {children}
            </div>
        </dialog>
    );
};
