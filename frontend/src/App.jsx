import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Card from "./components/Card";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <Hero />

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900">
            Powerful AI Features
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Turn thousands of customer reviews into actionable business
            intelligence using advanced AI-powered analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card
            title="📊 Sentiment Analysis"
            description="Detect positive, negative, and neutral customer emotions with intelligent AI models."
          />

          <Card
            title="🏷️ Smart Classification"
            description="Automatically categorize reviews into topics such as service, quality, delivery, and support."
          />

          <Card
            title="🧠 AI Insights"
            description="Generate business recommendations and discover hidden patterns in customer feedback."
          />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-slate-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              Trusted Performance
            </h2>
            <p className="text-gray-600 mt-3">
              Delivering reliable insights from customer reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:scale-105 transition">
              <h3 className="text-5xl font-bold text-blue-600">
                1000+
              </h3>
              <p className="mt-3 text-gray-600">
                Reviews Processed
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:scale-105 transition">
              <h3 className="text-5xl font-bold text-green-600">
                95%
              </h3>
              <p className="mt-3 text-gray-600">
                Prediction Accuracy
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:scale-105 transition">
              <h3 className="text-5xl font-bold text-purple-600">
                24/7
              </h3>
              <p className="mt-3 text-gray-600">
                Real-Time Monitoring
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default App;