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
            "bg-blue-600 text-white hover:bg-blue-700",

        secondary:
            "bg-gray-600 text-white hover:bg-gray-700",

        outline:
            "border border-blue-600 text-blue-600 hover:bg-blue-50",
    };

    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-5 py-2",
        lg: "px-7 py-3 text-lg",
    };

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg
        font-medium
        transition
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
        >
            {children}
        </button>
    );
}

export default Button;