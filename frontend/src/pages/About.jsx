import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function About({ darkMode, setDarkMode }) {
  const features = [
    {
      title: "Real-time Sentiment Engine",
      description: "Instantly categorizes customer reviews into Positive, Neutral, and Negative sentiments to monitor brand health.",
      icon: "🎯"
    },
    {
      title: "Granular Topic Classification",
      description: "Identifies recurring themes such as cleanliness, staff service, wifi facilities, food, value, and location.",
      icon: "🏷️"
    },
    {
      title: "Instant AI Response Generator",
      description: "Generates personalized, professionally phrased responses to reviews, saving customer support hours.",
      icon: "💬"
    },
    {
      title: "Analytics Trends & Reports",
      description: "Presents user sentiments in visual progress blocks and exports PDF/CSV summaries for leadership.",
      icon: "📊"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Paste or Import Reviews",
      description: "Input review logs from guest checkout books, Google Reviews, Booking.com, or TripAdvisor."
    },
    {
      step: "02",
      title: "NLP Model Processing",
      description: "The AI filters noise, extracts sentiment tokens, and matches them to category themes."
    },
    {
      step: "03",
      title: "Generate Responses & Act",
      description: "Read, edit, or copy the drafts, resolve guest issues, and improve business operations."
    }
  ];

  return (
    <div className={darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}>
      <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        
        {/* Intro Hero Section */}
        <section className="text-center py-10">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border ${
            darkMode ? "bg-slate-900 border-slate-800 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
          }`}>
            Our Mission
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6">
            About AI Smart Review Analyzer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed">
            Empowering modern businesses with natural language processing models to turn chaotic customer feedback into structured, actionable intelligence.
          </p>
        </section>

        {/* Narrative Box */}
        <section className={`p-8 sm:p-12 rounded-3xl border space-y-6 max-w-4xl mx-auto ${
          darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200/60 shadow-sm"
        }`}>
          <h2 className="text-2xl font-bold">Why Review Analysis Matters</h2>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Customer reviews hold the key to understanding how your business is performing in the real world. However, manually reading and classifying thousands of survey forms is time-consuming and prone to human bias.
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Our platform bridges this gap. By leveraging advanced Natural Language Processing models, we automatically parse user comments, tag them under topics like cleanliness, staff, location, or price, and generate context-aware draft responses instantly.
          </p>
        </section>

        {/* Core Capabilities */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight">Core System Capabilities</h2>
            <p className="text-sm text-slate-500 mt-2">What the platform does under the hood</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border space-y-4 hover:scale-[1.01] transition-transform duration-200 ${
                  darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="text-2xl w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works Steps */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight">How It Works</h2>
            <p className="text-sm text-slate-500 mt-2">A simple 3-step automated workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl border space-y-4 relative ${
                  darkMode ? "bg-slate-900/40 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <span className="text-4xl font-black text-blue-600/10 dark:text-blue-400/10 absolute top-6 right-6">
                  {step.step}
                </span>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default About;