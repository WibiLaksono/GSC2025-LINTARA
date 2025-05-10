import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE = "http://192.168.56.2:5000/api/reports";

// Helper function to get user ID from AsyncStorage
export const getUserId = async () => {
    try {
        const userId = await AsyncStorage.getItem("userUid");
        if (!userId) {
            throw new Error("User ID not found in AsyncStorage");
        }
        console.log("🟢 [getUserId] UID ditemukan:", userId);
        return userId;
    } catch (error) {
        throw new Error("Failed to retrieve user ID");
    }
};

// CREATE
export const createReport = async (reportData) => {
    try {
        const userId = await getUserId();
        const response = await axios.post(`${API_BASE}/createReport`, {
            ...reportData,
            UserID: userId,
        });

        const fullData = {
            ...reportData,
            UserID: userId,
        };

        console.log("🟢 [createReport] Data yang dikirim ke backend:", fullData);
        
        return response.data;
    } catch (error) {
        console.error("🔴 Backend error:", error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to create report");
    }
};

// READ
export const getReports = async () => {
    try {
        const response = await axios.get(`${API_BASE}/getReports`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to get reports");
    }
};

// UPDATE
export const updateReport = async (reportId, updatedData) => {
    try {
        const userId = await getUserId();
        const response = await axios.put(`${API_BASE}/updateReport/${reportId}`, {
            ...updatedData,
            UserID: userId,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update report");
    }
};

// DELETE
export const deleteReport = async (reportId) => {
    try {
        const userId = await getUserId();
        const response = await axios.delete(`${API_BASE}/deleteReport/${reportId}`, {
            data: { UserID: userId },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to delete report");
    }
};
