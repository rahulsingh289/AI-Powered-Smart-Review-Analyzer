import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
    Button,
    Modal,
    Toast,
    Loader,
} from "../components/ui";

function Dashboard({
    darkMode,
    setDarkMode,
}) {
    const [open, setOpen] = useState(false);
    const [showToast, setShowToast] =
        useState(false);

    return (
        <>
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />

            <main className="max-w-5xl mx-auto px-6 py-20 min-h-[70vh]">

                <h1 className="text-4xl font-bold mb-6">
                    Dashboard
                </h1>

                <p
                    className={`mb-8 ${darkMode
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}
                >
                    View analytics, sentiment trends,
                    and customer review insights.
                </p>

                <div
                    className={`p-8 rounded-2xl shadow-lg ${darkMode
                            ? "bg-gray-800"
                            : "bg-white"
                        }`}
                >
                    <h2 className="text-2xl font-semibold mb-4">
                        Review Analytics
                    </h2>

                    <Loader />

                    <div className="flex gap-4 mt-8">

                        <Button
                            variant="primary"
                            onClick={() => setOpen(true)}
                        >
                            View Details
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() =>
                                setShowToast(true)
                            }
                        >
                            Analyze Reviews
                        </Button>

                    </div>
                </div>

                <Modal
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    title="Review Details"
                >
                    <p className="mt-4">
                        Guest reviews show mostly
                        positive sentiment regarding
                        location and host experience.
                    </p>
                </Modal>

                {showToast && (
                    <Toast
                        message="Review analysis completed successfully!"
                    />
                )}

            </main>

            <Footer />
        </>
    );
}

export default Dashboard;