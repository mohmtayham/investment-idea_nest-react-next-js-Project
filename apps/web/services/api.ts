// lib/api.ts
// This file should be used for client-side API calls that do not require Server Actions for session management.
// For authenticated calls that need server-side session handling, use authFetch.

import { BACKEND_URL } from "../lib/constant";

// Helper to safely get the token from localStorage (client-side only)
const getClientToken = () => {
  if (typeof window !== "undefined") {
    console.log("--- [Client: api.ts] Attempting to retrieve token from localStorage ---");
    const token = localStorage.getItem("token");
    if (token) {
      console.log("--- [Client: api.ts] ✅ Token found in localStorage. --- ");
      return token;
    } else {
      console.log("--- [Client: api.ts] 🚫 No token found in localStorage. --- ");
    }
  }
  return null;
};

export const api = {
  get: async (url: string) => {
    console.log(`--- [Client: api.ts] Initiating GET request to: ${url} ---`);
    const token = getClientToken();
    const fullUrl = `${BACKEND_URL}${url}`;

    try {
      console.log(`--- [Client: api.ts] 📡 Sending GET request to: ${fullUrl} ---`);
      const res = await fetch(fullUrl, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });
      console.log(`--- [Client: api.ts] 📩 Response status for GET ${url}: ${res.status} ---`);

      if (res.status === 401) {
        console.warn("--- [Client: api.ts] 🔑 401 Unauthorized for GET. Redirecting to signin. --- ");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/auth/signin"; // Assuming /auth/signin is your login page
        }
        throw new Error("Unauthorized: Redirecting to login.");
      }

      if (!res.ok) {
        const errorBody = await res.text().catch(() => "No response body");
        console.error(`--- [Client: api.ts] ❌ GET request failed for ${url}. Status: ${res.status}, Body: ${errorBody} ---`);
        try {
          const errorJson = JSON.parse(errorBody);
          throw new Error(errorJson.message || `API error: ${res.status}`);
        } catch (parseError) {
          throw new Error(`API error: ${res.status} - ${errorBody}`);
        }
      }
      console.log(`--- [Client: api.ts] ✅ GET request successful for ${url}. ---`);
      return res.json();
    } catch (error) {
      console.error(`--- [Client: api.ts] 🔥 Error during GET request to ${fullUrl}: ${error instanceof Error ? error.message : String(error)} ---`);
      console.error(error);
      throw error;
    }
  },

  post: async (url: string, data: any) => {
    console.log(`--- [Client: api.ts] Initiating POST request to: ${url} with data: ${JSON.stringify(data)} ---`);
    const token = getClientToken();
    const fullUrl = `${BACKEND_URL}${url}`;

    try {
      console.log(`--- [Client: api.ts] 📡 Sending POST request to: ${fullUrl} ---`);
      const res = await fetch(fullUrl, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });
      console.log(`--- [Client: api.ts] 📩 Response status for POST ${url}: ${res.status} ---`);

      if (res.status === 401) {
        console.warn("--- [Client: api.ts] 🔑 401 Unauthorized for POST. Redirecting to signin. --- ");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/auth/signin";
        }
        throw new Error("Unauthorized: Redirecting to login.");
      }

      if (!res.ok) {
        const errorBody = await res.text().catch(() => "No response body");
        console.error(`--- [Client: api.ts] ❌ POST request failed for ${url}. Status: ${res.status}, Body: ${errorBody} ---`);
        try {
          const errorJson = JSON.parse(errorBody);
          throw new Error(errorJson.message || `API error: ${res.status}`);
        } catch (parseError) {
          throw new Error(`API error: ${res.status} - ${errorBody}`);
        }
      }
      console.log(`--- [Client: api.ts] ✅ POST request successful for ${url}. ---`);
      return res.json();
    } catch (error) {
      console.error(`--- [Client: api.ts] 🔥 Error during POST request to ${fullUrl}: ${error instanceof Error ? error.message : String(error)} ---`);
      console.error(error);
      throw error;
    }
  },

  put: async (url: string, data: any) => {
    console.log(`--- [Client: api.ts] Initiating PUT request to: ${url} with data: ${JSON.stringify(data)} ---`);
    const token = getClientToken();
    const fullUrl = `${BACKEND_URL}${url}`;

    try {
      console.log(`--- [Client: api.ts] 📡 Sending PUT request to: ${fullUrl} ---`);
      const res = await fetch(fullUrl, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });
      console.log(`--- [Client: api.ts] 📩 Response status for PUT ${url}: ${res.status} ---`);

      if (res.status === 401) {
        console.warn("--- [Client: api.ts] 🔑 401 Unauthorized for PUT. Redirecting to signin. --- ");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/auth/signin";
        }
        throw new Error("Unauthorized: Redirecting to login.");
      }

      if (!res.ok) {
        const errorBody = await res.text().catch(() => "No response body");
        console.error(`--- [Client: api.ts] ❌ PUT request failed for ${url}. Status: ${res.status}, Body: ${errorBody} ---`);
        try {
          const errorJson = JSON.parse(errorBody);
          throw new Error(errorJson.message || `API error: ${res.status}`);
        } catch (parseError) {
          throw new Error(`API error: ${res.status} - ${errorBody}`);
        }
      }
      console.log(`--- [Client: api.ts] ✅ PUT request successful for ${url}. ---`);
      return res.json();
    } catch (error) {
      console.error(`--- [Client: api.ts] 🔥 Error during PUT request to ${fullUrl}: ${error instanceof Error ? error.message : String(error)} ---`);
      console.error(error);
      throw error;
    }
  },
};

export default api;
