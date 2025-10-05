import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { retrieveActivities } from "./utils/api";
import { scheduleEvent } from "./utils/scheduleApi";

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState("");
  const [activities, setActivities] = useState([]); // Stores activities and card details
  const [selectedActivity, setSelectedActivity] = useState(null); // Track selected activity to edit
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    tags: "",
    deadline: "",
  });
  const [newMessage, setNewMessage] = useState(""); // Tracks the new message to submit
  const [loading, setLoading] = useState(false); // Loading state for retrieveActivities

  const location = useLocation();
  const navigate = useNavigate();

  // Safely check if all fields are filled
  const isFormComplete =
    formData.title.trim() &&
    formData.startTime &&
    formData.endTime &&
    formData.description.trim() &&
    formData.tags.trim() &&
    formData.deadline;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");

    if (!accessToken) navigate("/");

    setAccessToken(accessToken || "");
  }, [location.search, navigate]);

  const handleMessageSubmit = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);

    const parsedActivities = await retrieveActivities(newMessage);
    setLoading(false);

    if (parsedActivities && parsedActivities.length > 0) {
      const newActivities = parsedActivities.map((activity) => ({
        title: String(activity.title),
        startTime: activity.start_time ? String(activity.start_time.replace(".000Z", "")) : "",
        endTime: activity.end_time ? String(activity.end_time) : "",
        description: String(activity.metadata.raw_excerpt),
        tags: activity.metadata.descriptors.join(", "),
        deadline: activity.deadline ? String(activity.deadline) : "",
        scheduleStatus: null,
      }));

      const updatedActivities = [...activities, ...newActivities];
      setActivities(updatedActivities);
      setNewMessage("");

      // Auto-select first new activity
      const firstIndex = updatedActivities.length - newActivities.length;
      setSelectedActivity(firstIndex);
      setFormData({ ...newActivities[0] });
    }
  };

  const handleCardClick = (index) => {
    const activity = activities[index];
    setSelectedActivity(index);
    setFormData({ ...activity }); // deep clone to avoid shared references
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (selectedActivity !== null) {
      const updatedActivities = JSON.parse(JSON.stringify(activities)); // deep clone
      updatedActivities[selectedActivity][name] = value;
      setActivities(updatedActivities);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleMessageSubmit();
  };

  const handleSchedule = async () => {
    const result = await scheduleEvent(accessToken, formData);
    if (!result.success) console.error(result.message);
    return result.success;
  };

  return (
    <div className="flex h-screen">
      {/* Left Half: Chat UI */}
      <div className="w-3/4 p-6 flex flex-col border-r border-gray-300">
        <div className="text-lg font-bold text-center bg-gray-100 p-2 rounded-t-lg">
          Chat with AI
        </div>
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
            </div>
          )}

          {!loading &&
            activities.map((activity, index) => (
              <div
                key={index}
                className={`bg-white p-4 mb-4 border border-gray-300 rounded-lg cursor-pointer ${
                  selectedActivity === index ? "border-4 border-blue-500 animate-outline" : ""
                }`}
                onClick={() => handleCardClick(index)}
              >
                <p className="font-semibold">Activity #{index + 1}</p>
                <p>{activity.title}</p>
              </div>
            ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            className="p-3 w-full mt-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            className="p-3 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleMessageSubmit}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Right Half: Form */}
      <div className="w-1/4 p-6">
        {selectedActivity !== null && (
          <div>
            <div className="text-lg font-bold mb-4">
              Editing Activity #{selectedActivity + 1}
            </div>
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  type="datetime-local"
                  id="start-time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  type="datetime-local"
                  id="end-time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a description"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags (comma separated)"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Schedule Button */}
            <div className="mt-6 flex flex-col items-center">
              <Button
                className={`p-3 mt-4 w-full rounded-md ${
                  isFormComplete
                    ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isFormComplete}
                onClick={async () => {
                  const result = await handleSchedule();
                  const updated = JSON.parse(JSON.stringify(activities)); // deep clone
                  updated[selectedActivity].scheduleStatus = result;
                  setActivities(updated);
                }}
              >
                Schedule
              </Button>

              {activities[selectedActivity]?.scheduleStatus !== null && (
                <p
                  className={`mt-2 text-sm ${
                    activities[selectedActivity].scheduleStatus ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {activities[selectedActivity].scheduleStatus
                    ? "Scheduled successfully!"
                    : "Failed to schedule. Please try again."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
