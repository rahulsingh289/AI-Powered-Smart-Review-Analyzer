import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
    return (
        <>
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-20">
                <h1 className="text-4xl font-bold mb-6">
                    Login
                </h1>

                <p className="text-gray-600">
                    Sign in to access your AI review analysis dashboard.
                </p>
            </main>

            <Footer />
        </>
    );
}

export default Login;