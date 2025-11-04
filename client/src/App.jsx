import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegisterPage } from "./pages/Register";
import { DashboardPage } from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Register Page (Default) */}
        <Route path="/" element={<RegisterPage />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Optional: Custom 404 Page */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
              <h1 className="text-3xl font-bold mb-4">404 – Page Not Found</h1>
              <a
                href="/"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Go back home
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
