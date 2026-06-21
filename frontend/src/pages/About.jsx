import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About({ darkMode, setDarkMode }) {
    return (
        <>
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />

            <main className="max-w-5xl mx-auto px-6 py-20 min-h-[70vh]">
                <h1 className="text-4xl font-bold mb-6">
                    About Us
                </h1>

                <p
                    className={
                        darkMode
                            ? "text-gray-300"
                            : "text-gray-600"
                    }
                >
                    AI Smart Review Analyzer helps businesses
                    understand customer feedback using
                    artificial intelligence and sentiment
                    analysis.
                </p>
            </main>

            <Footer />
        </>
    );
}

export default About;