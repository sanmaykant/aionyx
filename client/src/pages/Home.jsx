import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router"

// Navbar Component
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

// Updated HomePage Component with Enhanced Content
export function HomePage({ isLoggedIn }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar navigate={navigate} isLoggedIn={isLoggedIn} />
      <div className="flex flex-col items-center justify-center flex-grow px-6">
        {/* Hero Section */}
        <div className="max-w-3xl text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Welcome to <span className="text-indigo-400">Aionyx</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Aionyx is your intelligent assistant that automates meeting scheduling
            by scraping important data from <span className="text-indigo-400">Gmail</span> and{" "}
            <span className="text-indigo-400">Telegram</span>.
          </p>

          <Button
            onClick={() => navigate("/register")}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Get Started
          </Button>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 max-w-5xl text-center space-y-8">
          <h2 className="text-3xl font-semibold text-indigo-400">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">1. Natural Language Processing</h3>
              <p className="text-gray-300">
                Aionyx is an intelligent AI-powered chatbot that helps users manage meetings, reminders, and team discussions seamlessly by identifing meetings from text messages, circular, pdf and images
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">2. Intelligent Analysis</h3>
              <p className="text-gray-300">
                Our AI analyzes the data to understand your schedule, preferences, and upcoming commitments.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">3. Automated Scheduling</h3>
              <p className="text-gray-300">
                Meetings are scheduled automatically, with reminders sent to ensure you never miss an important event.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl">
          <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-all duration-200">
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              📩 Gmail Scraper
            </h2>
            <p className="text-gray-300">
              Automatically detects meeting invites and reminders directly from
              your Gmail inbox.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-all duration-200">
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              💬 Telegram Sync
            </h2>
            <p className="text-gray-300">
              Syncs with Telegram chats to identify discussions and plan meetings
              accordingly.
            </p>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700 hover:shadow-lg transition-all duration-200">
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              📅 Smart Scheduling
            </h2>
            <p className="text-gray-300">
              Uses AI to auto-schedule meetings and reminders based on your
              availability.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16 max-w-5xl text-center space-y-8">
          <h2 className="text-3xl font-semibold text-indigo-400">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <p className="text-gray-300 italic">
                "Aionyx has transformed how I manage my meetings. No more manual scheduling!"
              </p>
              <p className="text-indigo-400 mt-2">- Jane Doe, Project Manager</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <p className="text-gray-300 italic">
                "The integration with Gmail and Telegram is seamless. Highly recommend!"
              </p>
              <p className="text-indigo-400 mt-2">- John Smith, Entrepreneur</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 max-w-3xl text-center space-y-4">
          <h2 className="text-3xl font-semibold text-indigo-400">Ready to Get Started?</h2>
          <p className="text-gray-300 text-lg">
            Join thousands of users who have streamlined their scheduling with Aionyx.
          </p>
          <Button
            onClick={() => navigate("/register")}
            className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  );
}

// About Us Page Component
export function AboutUs({ navigate, isLoggedIn }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar navigate={navigate} isLoggedIn={isLoggedIn} />
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-12">
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-4xl font-bold text-white">
            About <span className="text-indigo-400">Aionyx</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Aionyx is an innovative AI-powered assistant designed to revolutionize meeting scheduling.
            We specialize in automating the process by intelligently scraping data from your Gmail and Telegram accounts,
            ensuring that your calendar is always up-to-date and optimized for productivity.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <h2 className="text-2xl font-semibold text-indigo-400 mb-4">Our Mission</h2>
              <p className="text-gray-300">
                To empower professionals and teams by eliminating the hassle of manual scheduling.
                We believe in leveraging AI to create smarter, more efficient workflows.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
              <h2 className="text-2xl font-semibold text-indigo-400 mb-4">How We Work</h2>
              <p className="text-gray-300">
                Aionyx securely accesses your Gmail for meeting invites and reminders, and syncs with Telegram
                to capture relevant discussions. Our AI then analyzes this data to schedule meetings automatically,
                sending timely reminders to keep you on track.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-semibold text-indigo-400 mb-4">Why Choose Aionyx?</h2>
            <ul className="text-gray-300 text-left max-w-2xl mx-auto space-y-2">
              <li>• <strong>Secure Data Handling:</strong> We prioritize your privacy with encrypted data processing.</li>
              <li>• <strong>AI-Powered Insights:</strong> Intelligent analysis for personalized scheduling.</li>
              <li>• <strong>Seamless Integration:</strong> Works effortlessly with Gmail and Telegram.</li>
              <li>• <strong>Time-Saving Automation:</strong> Focus on what matters while we handle the rest.</li>
            </ul>
          </div>

          <div className="mt-12">
            <Button
              onClick={() => navigate("/register")}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Join Us Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}