import { login } from "@/api/OAuthApi";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("accessToken");

  const handleRegister = async () => {
    const { url } = await login();
    window.location.href = url;
  };

  useEffect(() => {
    if (!accessToken) return;
    localStorage.setItem("access-token", accessToken);
    navigate("/dashboard");
  }, [accessToken, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-4">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-lg text-center">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-4 text-white tracking-wide">
          Welcome to <span className="text-indigo-400">Aionyx</span>
        </h1>
        <p className="mb-8 text-gray-300 text-lg leading-relaxed">
          We help you stay productive by automatically managing your meetings.
          Aionyx connects with your <span className="font-semibold">Gmail</span> and{" "}
          <span className="font-semibold">Telegram</span> to intelligently
          extract event details and <span className="text-indigo-400">schedule meetings</span>{" "}
          for you — no manual work needed.
        </p>

        {/* Features Section */}
        <div className="text-left mb-8 space-y-3">
          <h2 className="text-xl font-semibold text-indigo-400 mb-2">What We Do:</h2>
          <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
            <li>🔍 Scrape meeting information from Gmail and Telegram messages</li>
            <li>📅 Automatically schedule meetings in your preferred calendar</li>
            <li>🤖 Save your time by eliminating manual meeting coordination</li>
            <li>🔒 Secure OAuth-based login — your data stays private</li>
          </ul>
        </div>

        {/* Register Button */}
        <Button
          onClick={handleRegister}
          className="w-full bg-indigo-500 hover:bg-indigo-600 transition-colors text-lg font-semibold py-3 rounded-lg"
        >
          Get Started with OAuth
        </Button>

        {/* Footer Note */}
        <p className="mt-6 text-sm text-gray-400">
          By continuing, you allow Aionyx to securely connect to your Gmail and Telegram accounts.
        </p>
      </div>
    </div>
  );
}
