import { useCallback, useState } from "react";

export const useModal = (initialState: boolean = false) => {
    const [isOpen, setIsOpen] = useState<boolean>(initialState);
    const open = useCallback(() => {
        setIsOpen(true);
    }, []);
    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    return { isOpen, open, close };
};
