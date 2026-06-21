import { useEffect } from "react";

/**
 * Modal Component
 *
 * Props:
 * - isOpen
 * - onClose
 * - title
 * - children
 */

function Modal({
    isOpen,
    onClose,
    title,
    children,
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">

                <h2 className="text-2xl font-bold mb-4">
                    {title}
                </h2>

                {children}

                <button
                    onClick={onClose}
                    className="
            mt-6
            bg-red-500
            text-white
            px-4
            py-2
            rounded-lg
          "
                >
                    Close
                </button>

            </div>

        </div>
    );
}

export default Modal;