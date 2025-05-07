import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.56.2:5000/api/auth'; // Update this URL when deployed

// Register User
export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data);
        const { token, uid } = response.data;
        await AsyncStorage.setItem('jwtToken', token);
        setAuthToken(token);
        return { uid, token };
    } catch (error) {
        console.error('Error registering user:', error.response?.data || error.message);
        throw error;
    }
};

// Login User
export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data);
        const { token, uid, userData } = response.data;
        await AsyncStorage.setItem('jwtToken', token);
        setAuthToken(token);
        return { uid, token, userData };
    } catch (error) {
        console.error('Error logging in:', error.response?.data || error.message);
        throw error;
    }
};

// Initialize token (you can call this in a layout or root component)
export const initializeAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
            setAuthToken(token);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error initializing auth token:', error.message);
        return false;
    }
};

// Helper to set Authorization header
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};
