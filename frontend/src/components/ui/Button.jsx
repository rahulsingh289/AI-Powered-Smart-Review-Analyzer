/**
 * Button Component
 *
 * Props:
 * - variant: primary | secondary | outline
 * - size: sm | md | lg
 * - disabled: boolean
 * - onClick: function
 * - children: ReactNode
 */

function Button({
    variant = "primary",
    size = "md",
    disabled = false,
    children,
    onClick,
}) {
    const variants = {
        primary:
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-500/5 active:scale-[0.98]",

        secondary:
            "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:text-slate-200 active:scale-[0.98]",

        outline:
            "border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-[0.98]",
    };

    const sizes = {
        sm: "px-4 py-2 text-xs rounded-xl font-bold",
        md: "px-5 py-2.5 text-sm rounded-2xl font-bold",
        lg: "px-7 py-3.5 text-base rounded-2xl font-bold",
    };

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`
                ${variants[variant]}
                ${sizes[size]}
                font-semibold
                transition-all
                duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:scale-100
                cursor-pointer
            `}
        >
            {children}
        </button>
    );
}

export default Button;