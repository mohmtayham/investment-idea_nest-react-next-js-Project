import { authFetch } from "@/lib/authFetch"; // For server-side authenticated calls
import { api } from "../services/api"; // For client-side API calls (if any, or for non-session-dependent calls)

const profileService = {
  getProfile: async () => {
    console.log("--- [Frontend: profileService] getProfile: Attempting to fetch user profile --- ");
    try {
      // Using authFetch for server-side authenticated profile retrieval
      const response = await authFetch("/profile/idea-owner");
      console.log(`--- [Frontend: profileService] getProfile: Response status from authFetch: ${response.status} ---`);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "No response body");
        console.error(`--- [Frontend: profileService] getProfile: ❌ API call failed. Status: ${response.status}, Body: ${errorBody} ---`);
        throw new Error(`Failed to fetch profile: ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
      console.log("--- [Frontend: profileService] getProfile: ✅ Profile data fetched successfully. --- ");
      return data;
    } catch (error) {
      console.error(`--- [Frontend: profileService] getProfile: 🔥 Error fetching profile: ${error instanceof Error ? error.message : String(error)} ---`);
      console.error(error);
      throw error;
    }
  },

  getMyIdeas: async () => {
    console.log("--- [Frontend: profileService] getMyIdeas: Attempting to fetch user ideas --- ");
    try {
      // Assuming getMyIdeas might be a client-side call or uses a different endpoint
      // If it requires server-side session, use authFetch. Otherwise, use api.get.
      // For consistency with profile, let's assume it should also be authenticated via authFetch.
      const response = await authFetch("/ideas/my-ideas"); // Assuming a backend endpoint like /ideas/my_ideas
      console.log(`--- [Frontend: profileService] getMyIdeas: Response status from authFetch: ${response.status} ---`);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "No response body");
        console.error(`--- [Frontend: profileService] getMyIdeas: ❌ API call failed. Status: ${response.status}, Body: ${errorBody} ---`);
        throw new Error(`Failed to fetch ideas: ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
      console.log("--- [Frontend: profileService] getMyIdeas: ✅ Ideas data fetched successfully. --- ");
      return data;
    } catch (error) {
      console.error(`--- [Frontend: profileService] getMyIdeas: 🔥 Error fetching ideas: ${error instanceof Error ? error.message : String(error)} ---`);
      console.error(error);
      throw error;
    }
  },
};

export default profileService;
