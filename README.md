# 🧠 Aionyx – AI Calendar Assistant

Aionyx is an **AI-powered calendar assistant** that automatically identifies and schedules meetings from various sources such as **text messages, PDFs, circulars, and even images**.  
It leverages the **Gemma API** for **Natural Language Processing (NLP)** to intelligently understand meeting contexts and populate your calendar accordingly.

---

## 🚀 Overview

Aionyx is built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** and follows a **client–server architecture**:

- 🖥️ **Client:** A React-based front end that provides users with an intuitive interface to view and manage their calendar events.  
- ⚙️ **Server:** A Node.js + Express backend that integrates with the Gemma API, processes uploaded files or messages, extracts meeting details, and communicates with external calendar services (via OAuth).  

---

## 🧩 Key Features

- 🤖 **AI-Powered Meeting Detection**  
  Automatically identifies meeting details (title, time, date, participants, and location) from unstructured data — text, documents, and images.

- 📅 **Automatic Calendar Scheduling**  
  Adds detected meetings directly to the user's calendar using OAuth credentials.

- 🧠 **Gemma API Integration**  
  Uses **Gemma** for Natural Language Processing (NLP) to interpret messages and extract actionable information.

- 🗂️ **Multi-Format Input Support**  
  Works with plain text, PDFs, images, and other communication formats.

- 🔒 **Secure OAuth Authentication**  
  Handles authentication securely with environment variables.

- 🧱 **Modular MERN Stack Architecture**  
  Cleanly separated front end (`client/`) and back end (`server/`) directories for scalability and maintainability.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **AI / NLP** | Gemma API |
| **Other Tools** | OAuth 2.0, Axios, Multer, dotenv |

---

## 📂 Environment File

Create a `.env` file inside the `server/` directory and include the following variables:

```bash
CLIENT_ID=<your_oauth_client_id>
CLIENT_SECRET=<your_oauth_client_secret>
REDIRECT_URI=<your_oauth_redirect_uri>
GEMMA_API_KEY=<your_gemma_api_key>
```
---

## 🧰 Getting Started

### 1️⃣ Prerequisites

Make sure you have the following installed:

-   Node.js (v16+ recommended)

-   MongoDB running locally or on the cloud

-   A valid **Gemma API key**

-   OAuth credentials (for Google Calendar or a similar service)### 2️⃣ Installation

## Clone the repository:

```bash
git clone https://github.com/sanmaykant/aionyx.git
cd aionyx
```

# Install dependencies for both the server and client:

## Install server dependencies
```bash
cd server
npm install
```

## Install client dependencies
```bash
cd ../client
npm install
```

* * * * *

# 3️⃣ Running the Application

## ▶️ Run the Backend

```bash
cd server
npm run dev
```

## 💻 Run the Frontend

```bash
cd client
npm start
```

The client should now be running at **http://localhost:5173**
and the server at **http://localhost:5000** (or your configured port).

* * * * *

💡 How It Works
---------------

1.  **Input Source**\
    The user uploads or inputs data --- this could be text, an image, or a document.

2.  **AI Extraction**\
    The backend uses the **Gemma API** to analyze the content and extract relevant meeting details (title, time, participants, etc.).

3.  **Event Scheduling**\
    Aionyx connects to your calendar through OAuth and automatically adds the identified meetings.

4.  **User Interaction**\
    The React front end displays events, allows manual adjustments, and syncs changes with the backend.
