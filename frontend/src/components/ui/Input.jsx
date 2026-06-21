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
        <div className="w-full">
            {label && (
                <label className="block mb-2 font-medium">
                    {label}
                </label>
            )}

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className="
          w-full
          border
          border-gray-300
          p-3
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}

export default Input;