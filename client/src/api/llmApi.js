import axios from "axios";

export const sendMessage = async (formData) => {
  const token = localStorage.getItem("access-token");

  const response = await axios.post("http://localhost:3000/api/sendMessage", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};
