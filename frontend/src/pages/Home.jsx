import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import Card from "../components/Card";
import Footer from "../components/Footer";

function Home({ darkMode, setDarkMode }) {
  return (
    <div className={darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}>
      <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />

      <Hero darkMode={darkMode} />

      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Powerful AI Features
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Leverage state-of-the-art machine learning models to parse, classify, and extract value from user feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            title="Sentiment Analysis"
            description="Detect positive, negative, and neutral customer emotions automatically."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            darkMode={darkMode}
          />

          <Card
            title="Smart Classification"
            description="Automatically categorize reviews into topics like cleaniness, host, location, food, and facilities."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            darkMode={darkMode}
          />

          <Card
            title="AI Insights"
            description="Generate customized, actionable business recommendations and professional responses from feedback."
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            darkMode={darkMode}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;