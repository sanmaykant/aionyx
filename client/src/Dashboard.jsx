import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { retrieveActivities } from "./utils/llmApi";

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
    deadline: "", // New field for deadline
  });
  const [newMessage, setNewMessage] = useState(""); // Tracks the new message to submit
  const [loading, setLoading] = useState(false); // Loading state for retrieveActivities

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("accessToken");

    if (!accessToken) navigate("/");

    setAccessToken(accessToken || "");
  }, [location.search, navigate]);

  const handleMessageSubmit = async () => {
    if (!newMessage.trim()) return; // Don't create an empty card

    setLoading(true); // Start loading when function is called

    // Parse activities from the message text
    const parsedActivities = await retrieveActivities(newMessage);

    setLoading(false); // Stop loading when function is finished

    // If there are activities, update the activities array with new cards
    if (parsedActivities && parsedActivities.length > 0) {
      const updatedActivities = [
        ...activities,
        ...parsedActivities.map((activity) => ({
          title: activity.title,
          startTime: activity.start_time,
          endTime: activity.end_time,
          description: activity.metadata.raw_excerpt,
          tags: activity.metadata.descriptors.join(", "),
          deadline: activity.deadline || "", // Include deadline if available
        })),
      ];

      setActivities(updatedActivities);
      setNewMessage(""); // Reset the input after submission

      // Auto-select the first activity in the newly created cards
      const newActivityIndex = updatedActivities.length - parsedActivities.length;
      setSelectedActivity(newActivityIndex);

      // Populate form with the data of the first new activity
      const firstNewActivity = updatedActivities[newActivityIndex];
      setFormData({
        title: firstNewActivity.title,
        startTime: firstNewActivity.startTime,
        endTime: firstNewActivity.endTime,
        description: firstNewActivity.description,
        tags: firstNewActivity.tags,
        deadline: firstNewActivity.deadline,
      });
    }
  };

  const handleCardClick = (index) => {
    // Populate the form with the data of the clicked activity
    const activity = activities[index];
    setSelectedActivity(index);
    setFormData({
      title: activity.title,
      startTime: activity.startTime,
      endTime: activity.endTime,
      description: activity.description,
      tags: activity.tags,
      deadline: activity.deadline,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-save data to the corresponding activity
    if (selectedActivity !== null) {
      const updatedActivities = [...activities];
      updatedActivities[selectedActivity] = {
        ...updatedActivities[selectedActivity],
        [name]: value,
      };
      setActivities(updatedActivities);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit(); // Submit the message when pressing Enter
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Half: Chat UI (with submit button for messages) */}
      <div className="w-3/4 p-6 flex flex-col border-r border-gray-300">
        <div className="text-lg font-bold text-center bg-gray-100 p-2 rounded-t-lg">
          Chat with AI
        </div>
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
          {/* Loader */}
          {loading && (
            <div className="flex justify-center items-center h-full">
              <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
            </div>
          )}

          {/* Activity Cards */}
          {!loading && activities.map((activity, index) => (
            <div
              key={index}
              className={`bg-white p-4 mb-4 border border-gray-300 rounded-lg cursor-pointer ${
                selectedActivity === index
                  ? "border-4 border-blue-500 animate-outline" // Add a subtle animation to the selected card outline
                  : ""
              }`}
              onClick={() => handleCardClick(index)}
            >
              <p className="font-semibold">Activity #{index + 1}</p>
              <p>{activity.title}</p> {/* Displaying the title of each activity */}
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

      {/* Right Half: Form for the selected activity */}
      <div className="w-1/4 p-6">
        {selectedActivity !== null && (
          <div>
            <div className="text-lg font-bold mb-4">
              {/* Display the activity number in the form */}
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
          </div>
        )}
      </div>
    </div>
  );
}
