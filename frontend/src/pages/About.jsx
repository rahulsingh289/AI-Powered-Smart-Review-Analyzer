import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
    return (
        <>
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold mb-6">
                    About Us
                </h1>

                <p className="text-gray-600">
                    AI Smart Review Analyzer helps businesses understand customer
                    feedback using artificial intelligence and sentiment analysis.
                </p>
            </main>

            <Footer />
        </>
    );
}

export default About;