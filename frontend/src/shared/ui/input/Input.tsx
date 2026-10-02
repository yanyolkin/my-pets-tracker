import { useState, type ComponentPropsWithoutRef, type Ref } from "react";
import clsx from "clsx";
import styles from "./Input.module.css";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
    label?: string;
    error?: string;
    ref?: Ref<HTMLInputElement>;
}

export const Input = ({
    label,
    error,
    type = "text",
    className,
    id,
    ref,
    ...props
}: InputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPasswordType = type === "password";
    const currentType = isPasswordType && isPasswordVisible ? "text" : type;

    return (
        <div
            className={clsx(styles.field, error && styles.hasError, className)}
        >
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={styles.inputWrapper}>
                <input
                    id={id}
                    type={currentType}
                    ref={ref}
                    className={clsx(
                        styles.input,
                        isPasswordType && styles.passwordInput,
                    )}
                    {...props}
                />

                {isPasswordType && (
                    <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        tabIndex={-1}
                        aria-label={
                            isPasswordVisible
                                ? "Скрыть пароль"
                                : "Показать пароль"
                        }
                    >
                        {isPasswordVisible ? (
                            <svg
                                xmlns="http://w3.org"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={styles.icon}
                            >
                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://w3.org"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={styles.icon}
                            >
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                <line x1="2" y1="2" x2="22" y2="22" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};
