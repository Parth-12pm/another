"use client";

import { useState } from "react";

interface GetResponseData {
  message: string;
}

interface PostResponseData {
  name: string;
  message: string;
}

interface CertificateResponse {
  status: string;
  barcodeId: string;
  certificateName: string;
  applicantName: string;
  designationOfSignatory: string;
  talukaOfSignatory: string;
  districtOfSignatory: string;
  dateAppliedOn: string;
}

interface ErrorResponse {
  error?: string;
  detail?: string;
}

export default function Home() {
  const [getResponse, setGetResponse] = useState<
    GetResponseData | ErrorResponse | null
  >(null);
  const [postResponse, setPostResponse] = useState<
    PostResponseData | ErrorResponse | null
  >(null);
  const [certificateResponse, setCertificateResponse] = useState<
    CertificateResponse | ErrorResponse | null
  >(null);
  const [migrationCertResponse, setMigrationCertResponse] = useState<
    CertificateResponse | ErrorResponse | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [barcode_id, setBarcodeId] = useState("");
  const [migration_barcode_id, setMigrationBarcodeId] = useState("");
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

  const handleIncomeVerification = async () => {
    if (!barcode_id) {
      alert("Please enter a barcode ID");
      return;
    }

    setLoading(true);
    setCertificateResponse(null);
    try {
      const response = await fetch(`/api/verify-income/${barcode_id}`);
      const data = await response.json();

      if (response.ok) {
        setCertificateResponse(data);
      } else {
        setCertificateResponse({ error: data.detail || "Verification failed" });
      }
    } catch (error) {
      console.error("Certificate verification failed:", error);
      setCertificateResponse({ error: "Failed to verify certificate" });
    }
    setLoading(false);
  };

  const handleMigrationVerification = async () => {
    if (!migration_barcode_id) {
      alert("Please enter a barcode ID for migration certificate");
      return;
    }

    setLoading(true);
    setMigrationCertResponse(null);
    try {
      const response = await fetch(`/verify-migration/${migration_barcode_id}`);
      const data = await response.json();

      if (response.ok) {
        setMigrationCertResponse(data);
      } else {
        setMigrationCertResponse({
          error: data.detail || "Verification failed",
        });
      }
    } catch (error) {
      console.error("Migration certificate verification failed:", error);
      setMigrationCertResponse({
        error: "Failed to verify migration certificate",
      });
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

  const renderCertificateResponse = (
    response: CertificateResponse | ErrorResponse | null,
    title: string
  ) => {
    if (!response) return null;

    // Type guard for error response
    if ("error" in response || "detail" in response) {
      return (
        <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {title} Error:
          </h3>
          <p className="text-red-700 font-medium">
            {response.error || response.detail}
          </p>
        </div>
      );
    }

    // Now TypeScript knows response is CertificateResponse
    const certificateData = response as CertificateResponse;

    return (
      <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          {title} Result:
        </h3>
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-semibold text-gray-700 md:min-w-48 md:mr-4 mb-1 md:mb-0">
              Status:
            </span>
            <span className="text-gray-600 flex-1">
              {certificateData.status}
            </span>
          </div>
          <div className="flex flex-col md:flex-row py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-semibold text-gray-700 md:min-w-48 md:mr-4 mb-1 md:mb-0">
              Barcode ID:
            </span>
            <span className="text-gray-600 flex-1 font-mono">
              {certificateData.barcodeId}
            </span>
          </div>
          <div className="flex flex-col md:flex-row py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-semibold text-gray-700 md:min-w-48 md:mr-4 mb-1 md:mb-0">
              Certificate Name:
            </span>
            <span className="text-gray-600 flex-1">
              {certificateData.certificateName}
            </span>
          </div>
          <div className="flex flex-col md:flex-row py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-semibold text-gray-700 md:min-w-48 md:mr-4 mb-1 md:mb-0">
              Applicant Name:
            </span>
            <span className="text-gray-600 flex-1 font-semibold">
              {certificateData.applicantName}
            </span>
          </div>
          <div className="flex flex-col md:flex-row py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-semibold text-gray-700 md:min-w-48 md:mr-4 mb-1 md:mb-0">
              Signatory Designation:
            </span>
            <span className="text-gray-600 flex-1">
              {certificateData.designationOfSignatory}
            </span>
          </div>
          <div className="flex flex-col md:flex-row py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-semibold text-gray-700 md:min-w-48 md:mr-4 mb-1 md:mb-0">
              Taluka:
            </span>
            <span className="text-gray-600 flex-1">
              {certificateData.talukaOfSignatory}
            </span>
          </div>
          <div className="flex flex-col md:flex-row py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-semibold text-gray-700 md:min-w-48 md:mr-4 mb-1 md:mb-0">
              District:
            </span>
            <span className="text-gray-600 flex-1">
              {certificateData.districtOfSignatory}
            </span>
          </div>
          <div className="flex flex-col md:flex-row py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-semibold text-gray-700 md:min-w-48 md:mr-4 mb-1 md:mb-0">
              Date Applied:
            </span>
            <span className="text-gray-600 flex-1">
              {certificateData.dateAppliedOn}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-5 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
        Certificate Verification System
      </h1>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          Connection Test
        </h2>
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Testing..." : "Test Connection"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          Income Certificate Verification
        </h2>
        <div className="flex flex-col space-y-4 mb-6">
          <input
            type="text"
            placeholder="Enter Barcode ID (18 or 22 digits)"
            value={barcode_id}
            onChange={(e) => setBarcodeId(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />
          <button
            onClick={handleIncomeVerification}
            disabled={loading || !barcode_id}
            className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Verifying..." : "Verify Income Certificate"}
          </button>
        </div>
        {renderCertificateResponse(certificateResponse, "Income Certificate")}
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          Migration Certificate Verification
        </h2>
        <div className="flex flex-col space-y-4 mb-6">
          <input
            type="text"
            placeholder="Enter Migration Certificate Barcode ID"
            value={migration_barcode_id}
            onChange={(e) => setMigrationBarcodeId(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />
          <button
            onClick={handleMigrationVerification}
            disabled={loading || !migration_barcode_id}
            className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Verifying..." : "Verify Migration Certificate"}
          </button>
        </div>
        {renderCertificateResponse(
          migrationCertResponse,
          "Migration Certificate"
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          API Test (GET Request)
        </h2>
        <button
          onClick={handleGetRequest}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Loading..." : "Send GET Request"}
        </button>
        {getResponse && (
          <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              GET Response:
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(getResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          API Test (POST Request)
        </h2>
        <div className="flex flex-col space-y-4 mb-6">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />
          <button
            onClick={handlePostRequest}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-sm hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Sending..." : "Send POST Request"}
          </button>
        </div>
        {postResponse && (
          <div className="mt-6 p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              POST Response:
            </h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(postResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
