import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "http://192.168.56.2:5000/api";

// Helper function to get UID from AsyncStorage
const getStoredUid = async () => {
  try {
    const uid = await AsyncStorage.getItem("userUid");
    if (!uid) {
      throw new Error("User UID not found in storage");
    }
    return uid;
  } catch (error) {
    console.error("Error retrieving UID from storage:", error.message);
    throw error;
  }
};

// Get all challenges
export const getAllChallenges = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/challenges/getChallenge`);
    return response.data;
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw error.response ? error.response.data : error;
  }
};

// Get a challenge by ID
export const getChallengeById = async (challengeId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/challenges/getChallenge/${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching challenge by ID:", error);
    throw error.response ? error.response.data : error;
  }
};

// Get challenges by current authenticated user
export const getChallengesByCurrentUser = async () => {
  try {
    const uid = await getStoredUid();
    const response = await axios.get(`${BASE_URL}/challenges/historical/`);
    const { data } = response.data;

    // Filter berdasarkan UID saat ini
    const userChallengeHistories = data.filter((item) => item.UserID === uid);

    // Ambil daftar ChallengeID
    const challengeIds = userChallengeHistories.map((item) => item.ChallengeID);

    if (!challengeIds || challengeIds.length === 0) {
      return []; // Tidak ada tantangan yang diikuti
    }

    // Ambil detail tiap tantangan
    const challenges = await Promise.all(
      challengeIds.map(async (challengeId) => {
        const challenge = await getChallengeById(challengeId);
        return challenge;
      })
    );

    return challenges;
  } catch (error) {
    console.error("Error fetching challenges by current user:", error);
    throw error.response ? error.response.data : error;
  }
};

// Create a new challenge
export const createChallenge = async (challengeData) => {
  try {
    const uid = await getStoredUid();
    const requestData = {
      ...challengeData,
      UserID: uid,
    };
    console.log("Data sent to backend:", requestData);
    const response = await axios.post(
      `${BASE_URL}/challenges/createChallenge`,
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating challenge:", error);
    throw error.response ? error.response.data : error;
  }
};

// Update a challenge
export const updateChallenge = async (challengeId, updatedData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/challenges/updateChallenge/${challengeId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating challenge:", error);
    throw error.response ? error.response.data : error;
  }
};

// Delete a challenge (soft delete)
export const deleteChallenge = async (challengeId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/challenges/deleteChallenge/${challengeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting challenge:", error);
    throw error.response ? error.response.data : error;
  }
};

// Get participants of a challenge and count them
export const getChallengeParticipants = async (challengeId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/challenges/historical/${challengeId}/participants`
    );
    const { participants } = response.data;

    const formattedParticipants = participants.map((participant) => ({
      UserID: participant.UserID,
      JoinedAt: participant.JoinedAt ? new Date(participant.JoinedAt) : null,
    }));

    return { challengeId, participants: formattedParticipants };
  } catch (error) {
    console.error("Error fetching challenge participants:", error);
    throw error.response ? error.response.data : error;
  }
};

// Check if user has already joined a challenge
export const hasUserJoinedChallenge = async (challengeId) => {
  try {
    const uid = await getStoredUid();
    const { participants } = await getChallengeParticipants(challengeId);

    const userHasJoined = participants.some(
      (participant) => participant.UserID === uid
    );
    return userHasJoined;
  } catch (error) {
    console.error("Error checking if user has joined challenge:", error);
    throw error.response ? error.response.data : error;
  }
};

// Join a challenge
export const joinChallenge = async (challengeId) => {
  try {
    const uid = await getStoredUid();
    const response = await axios.post(
      `${BASE_URL}/challenges/historical/join`,
      {
        ChallengeID: challengeId,
        UserID: uid,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error joining challenge:", error);
    throw error.response ? error.response.data : error;
  }
};
