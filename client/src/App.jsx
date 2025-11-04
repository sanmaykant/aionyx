import { useEffect, useState } from "react";
import { RegisterPage } from "./pages/Register";
import { DashboardPage } from "./pages/Dashboard";
import { HomePage } from "./pages/Home";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    // Detect current URL path
    const path = window.location.pathname;
    if (path === "/" || path === "/home") setCurrentPage("home");
    else if (path === "/register") setCurrentPage("register");
    else if (path === "/dashboard") setCurrentPage("dashboard");
    else setCurrentPage("404");
  }, []);

  // Navigate between pages
  const navigate = (path) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("popstate"));
  };

  // Listen for browser navigation (back/forward)
  useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname;
      if (path === "/" || path === "/home") setCurrentPage("home");
      else if (path === "/register") setCurrentPage("register");
      else if (path === "/dashboard") setCurrentPage("dashboard");
      else setCurrentPage("404");
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  // Render current page
  return (
    <>
      {currentPage === "home" && <HomePage navigate={navigate} />}
      {currentPage === "register" && <RegisterPage navigate={navigate} />}
      {currentPage === "dashboard" && <DashboardPage navigate={navigate} />}
      {currentPage === "404" && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
          <h1 className="text-3xl font-bold mb-4">404 – Page Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            Go back home
          </button>
        </div>
      )}
    </>
  );
}

export default App;
