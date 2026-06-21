/**
 * Toast Component
 *
 * Props:
 * - message
 */

function Toast({ message }) {
    return (
        <div
            className="
        fixed
        top-5
        right-5
        bg-green-600
        text-white
        px-5
        py-3
        rounded-lg
        shadow-lg
        z-50
      "
        >
            {message}
        </div>
    );
}

export default Toast;