import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://192.168.56.2:5000/api/users';

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
        const response = await axios.get(`${API_BASE}/${uid}`);
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
        const response = await axios.put(`${API_BASE}/${uid}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error.response ? error.response.data : error;
    }
};