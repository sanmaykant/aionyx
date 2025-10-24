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
  const [activity, setActivity]=useState([]);

  // handle file selection (image or PDF)
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

  // handle submit (send text + file)
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("message", newMessage);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    try {
      const acti=await sendMessage(formData);
      setActivity(acti.body);
      console.log(acti.body);
      setNewMessage("");
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Button onClick={logout}>Logout</Button>

      {/* Text Input */}
      <input
        type="text"
        placeholder="Please enter the text"
        className="border p-2 rounded w-full"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />

      {/* File Upload Input */}
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="block"
      />

      {/* Preview Section */}
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="w-48 h-48 object-cover rounded"
          />
        </div>
      )}
      {selectedFile && selectedFile.type === "application/pdf" && (
        <p className="text-sm text-gray-500 mt-2">📄 {selectedFile.name}</p>
      )}
      <Activities activitiesArray={activity} />
      {/* Submit Button */}
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
