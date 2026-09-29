import { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, InertiaLinkProps } from "@inertiajs/react";

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    size?: "sm" | "md" | "lg";
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    href?: string;
    inertiaProps?: Omit<InertiaLinkProps, "href" | "children">;
}

export default function PrimaryButton({
    children,
    className = "",
    disabled = false,
    isLoading = false,
    size = "md",
    leftIcon,
    rightIcon,
    href,
    inertiaProps,
    type = "submit",
    ...props
}: PrimaryButtonProps) {
    const sizeClasses = {
        sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
        md: "px-4 py-2.5 text-sm rounded-xl gap-2",
        lg: "px-6 py-3.5 text-base rounded-xl gap-2.5",
    };

    const baseClasses = `
        inline-flex items-center justify-center font-semibold text-white
        bg-blue-600 hover:bg-blue-700 active:bg-blue-800
        border border-transparent shadow-sm shadow-blue-500/10
        transition duration-150 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-blue-600/20
        disabled:bg-blue-400 disabled:cursor-not-allowed disabled:shadow-none
        ${sizeClasses[size]}
        ${className}
    `;

    const content = (
        <>
            {/* Loading Spinner */}
            {isLoading ? (
                <svg
                    className="animate-spin -ml-1 h-4 w-4 text-white shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : (
                leftIcon && <span className="shrink-0">{leftIcon}</span>
            )}

            <span>{children}</span>

            {!isLoading && rightIcon && (
                <span className="shrink-0">{rightIcon}</span>
            )}
        </>
    );

    // Render as Inertia Link if href is provided
    if (href) {
        return (
            <Link href={href} className={baseClasses} {...inertiaProps}>
                {content}
            </Link>
        );
    }

    // Render as HTML Button
    return (
        <button
            {...props}
            type={type}
            disabled={disabled || isLoading}
            className={baseClasses}
        >
            {content}
        </button>
    );
}
