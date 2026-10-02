import type { ComponentPropsWithoutRef } from "react";
import styles from "./CloseButton.module.css";

export const CloseButton = ({
    ...props
}: ComponentPropsWithoutRef<"button">) => {
    return (
        <button className={styles.button} {...props}>
            <span></span>
            <span></span>
        </button>
    );
};
