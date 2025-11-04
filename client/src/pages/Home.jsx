import { Button } from "@/components/ui/button";

export function HomePage({ navigate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6">
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
    </div>
  );
}
