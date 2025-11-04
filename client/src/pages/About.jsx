import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router"

// Navbar Component (Reused from previous)
export function Navbar({ navigate, isLoggedIn }) {
  return (
    <nav className="bg-gray-900 p-4 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-indigo-400 font-bold text-xl">Aionyx</div>
        <div className="space-x-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Home
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigate("/about");
            }}
            className="text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            About Us
          </a>
          {isLoggedIn ? (
            <a
              href="/dashboard"
              onClick={(e) => {
                e.preventDefault();
                navigate("/dashboard");
              }}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Dashboard
            </a>
          ) : (
            <>
              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Signup
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// About Us Page Component
export function AboutPage({isLoggedIn }) {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar navigate={navigate} isLoggedIn={isLoggedIn} />
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl text-center space-y-6 mb-12">
          <h1 className="text-5xl font-bold text-white">
            About <span className="text-indigo-400">Aionyx</span>
          </h1>
          <p className="text-gray-300 text-xl leading-relaxed">
            Revolutionizing meeting scheduling with AI-powered automation. Aionyx intelligently scrapes data from your Gmail and Telegram to keep your calendar optimized and your productivity soaring.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="max-w-4xl space-y-8 mb-12">
          <h2 className="text-3xl font-semibold text-indigo-400 text-center">Our Story</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Founded in 2023, Aionyx was born from the frustration of endless manual scheduling and missed meetings. Our team of AI experts and productivity enthusiasts recognized the need for a smarter way to manage time. By leveraging advanced data scraping and machine learning, we created an assistant that not only schedules meetings but anticipates your needs.
          </p>
        </div>

        {/* How We Work Section */}
        <div className="max-w-4xl space-y-8 mb-12">
          <h2 className="text-3xl font-semibold text-indigo-400 text-center">How We Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">Gmail Integration</h3>
              <p className="text-gray-300">
                Securely access your Gmail to detect meeting invites, reminders, and calendar events automatically.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">Telegram Sync</h3>
              <p className="text-gray-300">
                Analyze Telegram chats to identify discussions that require scheduling or follow-ups.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">AI Scheduling</h3>
              <p className="text-gray-300">
                Our AI processes the data to schedule meetings, send reminders, and optimize your availability.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="max-w-4xl space-y-8 mb-12">
          <h2 className="text-3xl font-semibold text-indigo-400 text-center">Why Choose Aionyx?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <h3 className="text-xl font-semibold text-indigo-400 mb-4">🔒 Privacy First</h3>
              <p className="text-gray-300">
                Your data is encrypted and processed securely. We never store sensitive information without your consent.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <h3 className="text-xl font-semibold text-indigo-400 mb-4">⚡ Efficiency Boost</h3>
              <p className="text-gray-300">
                Save hours each week with automated scheduling that adapts to your lifestyle and preferences.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <h3 className="text-xl font-semibold text-indigo-400 mb-4">🔄 Seamless Integration</h3>
              <p className="text-gray-300">
                Works effortlessly with your existing Gmail and Telegram accounts—no complex setup required.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <h3 className="text-xl font-semibold text-indigo-400 mb-4">📈 Smart Insights</h3>
              <p className="text-gray-300">
                Gain valuable insights into your scheduling patterns to improve productivity and work-life balance.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section (Optional) */}
        <div className="max-w-4xl space-y-8 mb-12">
          <h2 className="text-3xl font-semibold text-indigo-400 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-center">
              <div className="w-24 h-24 bg-indigo-400 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">A</div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">Alex Johnson</h3>
              <p className="text-gray-300">CEO & Founder</p>
              <p className="text-gray-400 text-sm mt-2">Expert in AI and productivity solutions.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-center">
              <div className="w-24 h-24 bg-indigo-400 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">B</div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">Bella Chen</h3>
              <p className="text-gray-300">CTO</p>
              <p className="text-gray-400 text-sm mt-2">Leading our tech innovation and data security.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 text-center">
              <div className="w-24 h-24 bg-indigo-400 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">C</div>
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">Carlos Rivera</h3>
              <p className="text-gray-300">Head of Product</p>
              <p className="text-gray-400 text-sm mt-2">Ensuring Aionyx meets user needs perfectly.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-semibold text-indigo-400">Ready to Transform Your Scheduling?</h2>
          <p className="text-gray-300 text-lg">
            Join the Aionyx community and experience the future of meeting management.
          </p>
          <Button
            onClick={() => navigate("/register")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
}
