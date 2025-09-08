"use client";

import { useState } from "react";

interface GetResponseData {
  message: string;
}

interface PostResponseData {
  name: string;
  message: string;
}

interface ErrorResponse {
  error: string;
}

export default function Home() {
  const [getResponse, setGetResponse] = useState<
    GetResponseData | ErrorResponse | null
  >(null);
  const [postResponse, setPostResponse] = useState<
    PostResponseData | ErrorResponse | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleGetRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/hello");
      const data = await response.json();
      setGetResponse(data);
    } catch (error) {
      console.error("GET request failed:", error);
      setGetResponse({ error: "Failed to fetch" });
    }
    setLoading(false);
  };

  const handlePostRequest = async () => {
    if (!name || !message) {
      alert("Please fill in both name and message fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/hello", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, message }),
      });
      const data = await response.json();
      setPostResponse(data);
    } catch (error) {
      console.error("POST request failed:", error);
      setPostResponse({ error: "Failed to post" });
    }
    setLoading(false);
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test");
      const data = await response.json();
      alert(`Connection test: ${data.status} - ${data.message}`);
    } catch (error) {
      console.error("Connection test failed:", error);
      alert("Connection failed!");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Next.js + FastAPI Test App</h1>

      <div className="section">
        <h2>Connection Test</h2>
        <button onClick={testConnection} disabled={loading}>
          {loading ? "Testing..." : "Test Connection"}
        </button>
      </div>

      <div className="section">
        <h2>GET Request Test</h2>
        <button onClick={handleGetRequest} disabled={loading}>
          {loading ? "Loading..." : "Send GET Request"}
        </button>
        {getResponse && (
          <div className="response">
            <h3>GET Response:</h3>
            <pre>{JSON.stringify(getResponse, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="section">
        <h2>POST Request Test</h2>
        <div className="form">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handlePostRequest} disabled={loading}>
            {loading ? "Sending..." : "Send POST Request"}
          </button>
        </div>
        {postResponse && (
          <div className="response">
            <h3>POST Response:</h3>
            <pre>{JSON.stringify(postResponse, null, 2)}</pre>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .section {
          margin: 30px 0;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }

        button {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        button:hover {
          background-color: #0051a2;
        }

        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .response {
          margin-top: 20px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }

        pre {
          background-color: #333;
          color: #fff;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }

        h1 {
          text-align: center;
          color: #333;
        }

        h2 {
          color: #0070f3;
        }
      `}</style>
    </div>
  );
}
