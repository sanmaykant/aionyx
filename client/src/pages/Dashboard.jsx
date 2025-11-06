import { Button } from "@/components/ui/button";
import { useState } from "react";
import { sendMessage } from "@/api/llmApi";
import Activities from "@/components/Activities";

export function DashboardPage() {
  const logout = () => {
    localStorage.removeItem("access-token");
    window.location.reload();
  };

  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false); // 🔹 Loading state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!newMessage && !selectedFile) return;
    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("message", newMessage);
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const acti = await sendMessage(formData);
      setActivity(acti.body);
      setNewMessage("");
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <Button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 transition-colors"
        >
          Logout
        </Button>
      </header>

      {/* Main Content divided into Chat + Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 🔹 Chat Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          {/* Message Input */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Message
            </label>
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Upload Image or PDF
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border border-gray-600"
              />
            </div>
          )}
          {selectedFile && selectedFile.type === "application/pdf" && (
            <p className="text-sm text-gray-400 mt-2">📄 {selectedFile.name}</p>
          )}

          {/* Submit Button with Loading */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-indigo-500 hover:bg-indigo-600 px-6 py-2 font-semibold flex items-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>

          {/* Activities Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
            <div className="bg-gray-700 rounded-xl p-4 shadow-inner">
              <Activities activitiesArray={activity} />
            </div>
          </div>
        </div>

        {/* 🔹 Schedule Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Schedule</h3>
          <div className="text-gray-400 text-sm">
            {/* Replace this placeholder with your scheduling component later */}
            <p>No schedules available yet. You can add your schedule module here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
