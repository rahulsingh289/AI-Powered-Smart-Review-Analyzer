/**
 * Input Component
 *
 * Props:
 * - label
 * - placeholder
 * - type
 * - value
 * - onChange
 * - error
 */

function Input({
    label,
    placeholder,
    type = "text",
    value,
    onChange,
    error,
}) {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className={`
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    border
                    transition-all
                    duration-200
                    bg-slate-50/50
                    dark:bg-slate-950/50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    text-sm
                    border-slate-200
                    dark:border-slate-800
                    text-slate-900
                    dark:text-white
                    placeholder-slate-400
                    dark:placeholder-slate-600
                `}
            />

            {error && (
                <p className="text-red-500 text-xs mt-1 font-semibold">
                    {error}
                </p>
            )}
        </div>
    );
}

export default Input;