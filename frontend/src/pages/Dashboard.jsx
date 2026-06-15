import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard() {
    return (
        <>
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold mb-6">
                    Dashboard
                </h1>

                <p className="text-gray-600">
                    View analytics, sentiment trends, and customer review insights.
                </p>
            </main>

            <Footer />
        </>
    );
}

export default Dashboard;