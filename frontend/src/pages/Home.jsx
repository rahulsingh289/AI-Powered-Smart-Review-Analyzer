import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

function Home({ darkMode, setDarkMode }) {
    return (
        <>
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />

            <Hero />

            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-4xl font-bold text-center mb-10">
                    Powerful AI Features
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    <Card
                        title="📊 Sentiment Analysis"
                        description="Detect positive, negative, and neutral customer emotions."
                    />

                    <Card
                        title="🏷️ Smart Classification"
                        description="Automatically categorize reviews into topics."
                    />

                    <Card
                        title="🧠 AI Insights"
                        description="Generate business recommendations from feedback."
                    />

                </div>
            </section>

            <Footer />
        </>
    );
}

export default Home;