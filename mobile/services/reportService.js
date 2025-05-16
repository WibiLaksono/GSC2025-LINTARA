import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.apiBaseUrl;

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

// Create a new report
export const createReport = async (reportData, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', {
            uri: imageFile.uri,
            type: imageFile.type,
            name: imageFile.name,
        });
        Object.keys(reportData).forEach(key => {
            formData.append(key, reportData[key]);
        });

        const response = await axios.post(`${BASE_URL}/reports/createReport`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const { id, message, result, category } = response.data;

        console.log("🟢 [createReport] Report created successfully:", {
            id,
            message,
            result,
            category,
        });

        return { id, message, result, category };
    } catch (error) {
        console.error("🔴 [createReport] Error creating report:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to create report");
    }
};

// Get a report by ID
export const getReportById = async (reportId) => {
    try {
        const response = await axios.get(`${BASE_URL}/reports/getReport/${reportId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching report by ID:', error);
        throw error.response ? error.response.data : error;
    }
};

// Count reports by user in a challenge
export const countReportsByUserInChallenge = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/reports/countByUser/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error counting reports by user in challenge:', error);
        throw error.response ? error.response.data : error;
    }
};


// READ
export const getReports = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/reports/getReports`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to get reports");
    }
};

// UPDATE
export const updateReport = async (reportId, updatedData) => {
    try {
        const userId = await getUserId();
        const response = await axios.put(`${BASE_URL}/reports/updateReport/${reportId}`, {
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
        const response = await axios.delete(`${BASE_URL}/reports/deleteReport/${reportId}`, {
            data: { UserID: userId },
        });
        console.log("🟢 [deleteReport] Response sent to database:", response.data);
        return response.data;
    } catch (error) {
        console.error("🔴 [deleteReport] Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to delete report");
    }
};
