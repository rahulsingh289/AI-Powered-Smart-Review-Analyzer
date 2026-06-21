import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
    Input,
    Button,
} from "../components/ui";

function Login({ darkMode, setDarkMode }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
            />

            <main className="max-w-md mx-auto px-6 py-20 min-h-[70vh]">

                <h1 className="text-4xl font-bold mb-8 text-center">
                    Login
                </h1>

                <div
                    className={`p-8 rounded-2xl shadow-lg ${darkMode
                            ? "bg-gray-800"
                            : "bg-white"
                        }`}
                >
                    <Input
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <div className="mt-4">
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    <div className="mt-6">
                        <Button variant="primary" size="lg">
                            Login
                        </Button>
                    </div>
                </div>

            </main>

            <Footer />
        </>
    );
}

export default Login;