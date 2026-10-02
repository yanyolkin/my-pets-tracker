import { type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./Button.module.css";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
    variant?: "primary" | "secondary";
}

export const Button = ({
    children,
    variant = "primary",
    type = "button",
    className,
    ...props
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={clsx(styles.button, styles[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};
