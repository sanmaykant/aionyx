import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { sendMessage } from "@/api/llmApi";
import { scheduleApi } from "@/api/scheduleApi";  // Import the scheduleApi function

// Utility function to convert UTC date to local format
const convertToLocalDatetime = (utcDate) => {
  if (!utcDate) return "";
  const localDate = new Date(utcDate.replace("Z", ""));
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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
  const [selectedActivity, setSelectedActivity] = useState(null); // For selected card activity

  // Normalize the activity object to ensure no field is undefined
  const normalizeActivity = (activity) => {
    return activity.map((acti) => ({
      id: acti.id || Math.random().toString(36).substring(7), // Unique ID if not already present
      title: acti.title || "",  // Default to an empty string if title is missing
      start: acti.start_time || null, // Default to null if start_time is missing
      end: acti.end_time || null, // Default to null if end_time is missing
      deadline: acti.deadline || null, // Default to null if deadline is missing
      description: acti.metadata?.raw_excerpt || "", // Default to an empty string if description is missing
      tags: acti.metadata?.descriptors || [], // Default to an empty array if tags are missing
      scheduleResult: null, // Initialize scheduleResult for each activity
    }));
  };

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
      const normalizedActivities = normalizeActivity(acti.body);
      setActivity(normalizedActivities);
      setNewMessage("");
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity); // Set the clicked activity to be shown on the right
  };

  // Function to update an activity in the activities list
  const updateActivityInList = (updatedActivity) => {
    setActivity(prevActivity =>
      prevActivity.map(acti =>
        acti.id === updatedActivity.id ? updatedActivity : acti // Use ID to update
      )
    );
  };

  const handleActivityChange = (e, field) => {
    const updatedActivity = { ...selectedActivity, [field]: e.target.value };
    setSelectedActivity(updatedActivity); // Update the selectedActivity in the form
    updateActivityInList(updatedActivity); // Update the activity in the list too
  };

  // Function to handle the schedule button click
  const handleScheduleClick = async () => {
    if (!selectedActivity) return;
    const access_token = localStorage.getItem("access-token");
    try {
      const result = await scheduleApi(access_token, selectedActivity); // Call the scheduleApi function
      const updatedActivity = { ...selectedActivity, scheduleResult: result }; // Update the selected activity with the schedule result
      setSelectedActivity(updatedActivity); // Update the selectedActivity in the state
      updateActivityInList(updatedActivity); // Update the activity in the list with the result
    } catch (error) {
      console.error("Error scheduling activity:", error);
      const updatedActivity = { 
        ...selectedActivity, 
        scheduleResult: { message: "Error scheduling activity. Please try again." } 
      };
      setSelectedActivity(updatedActivity); // Update the selectedActivity in the state
      updateActivityInList(updatedActivity); // Update the activity in the list with the result
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col">
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
      <div className="flex flex-grow gap-8">
        {/* 🔹 Chat Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between w-full overflow-y-auto max-h-[calc(100vh-120px)]"> {/* Added max-h */}
          {/* Activities Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
            <div className="bg-gray-700 rounded-xl p-4 shadow-inner space-y-4">
              {activity.map((acti, idx) => (
                <div
                  key={acti.id} // Use the ID as the key here
                  className="bg-gray-600 p-4 rounded-lg cursor-pointer"
                  onClick={() => handleActivityClick(acti)}
                >
                  <h4 className="text-lg font-semibold">{acti.title}</h4>
                  <p className="text-sm text-gray-400">Start: {acti.start}</p>
                  <p className="text-sm text-gray-400">End: {acti.end}</p>
                  <p className="text-sm text-gray-400">Description: {acti.description}</p>
                  <p className="text-sm text-gray-400">Tags: {acti.tags.join(", ")}</p>
                  <p className="text-sm text-gray-400">Deadline: {acti.deadline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input and File Upload */}
          <div className="mt-8 space-y-4">
            {/* Message Input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">Message</label>
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
              <label className="block mb-2 text-sm font-medium text-gray-300">Upload Image or PDF</label>
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

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit} 
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading} // Disable while loading
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>

        {/* 🔹 Schedule Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full">
          <h3 className="text-xl font-semibold mb-4">Edit Activity</h3>
          {selectedActivity ? (
            <div className="space-y-4">
              {/* Activity Form */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  value={selectedActivity.title}
                  onChange={(e) => handleActivityChange(e, "title")}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Start Time</label>
                <input
                  type="datetime-local"
                  value={convertToLocalDatetime(selectedActivity.start)}
                  onChange={(e) => handleActivityChange(e, "start")}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300">End Time</label>
                <input
                  type="datetime-local"
                  value={convertToLocalDatetime(selectedActivity.end)}
                  onChange={(e) => handleActivityChange(e, "end")}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={selectedActivity.description}
                  onChange={(e) => handleActivityChange(e, "description")}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Tags</label>
                <input
                  type="text"
                  value={selectedActivity.tags.join(", ")}
                  onChange={(e) => handleActivityChange(e, "tags")}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Comma separated"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-300">Deadline</label>
                <input
                  type="datetime-local"
                  value={convertToLocalDatetime(selectedActivity.deadline)}
                  onChange={(e) => handleActivityChange(e, "deadline")}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Schedule Button */}
              <Button onClick={handleScheduleClick} className="w-full mt-4">
                Schedule
              </Button>

              {/* Schedule Result */}
              {selectedActivity.scheduleResult && (
                <div className="mt-4 text-sm text-gray-400">
                  <strong>Scheduling Result:</strong>
                  <p>{selectedActivity.scheduleResult.message}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Select an activity to edit its details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

