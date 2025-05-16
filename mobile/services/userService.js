import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.apiBaseUrl;

// Helper function to get UID from AsyncStorage
const getStoredUid = async () => {
    try {
        const uid = await AsyncStorage.getItem('userUid');
        if (!uid) {
            throw new Error('User UID not found in storage');
        }
        return uid;
    } catch (error) {
        console.error('Error retrieving UID from storage:', error.message);
        throw error;
    }
};

// Get User by ID
export const getUserById = async () => {
    try {
        const uid = await getStoredUid();
        const response = await axios.get(`${BASE_URL}/users/${uid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error.response ? error.response.data : error;
    }
};

// Edit User
export const editUser = async (userData) => {
    try {
        const uid = await getStoredUid();
        const response = await axios.put(`${BASE_URL}/users/${uid}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error.response ? error.response.data : error;
    }
};