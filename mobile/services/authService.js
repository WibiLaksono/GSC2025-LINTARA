import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.56.2:5000/api/auth';

// Register User
export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data);
        const { token, uid } = response.data;
        await AsyncStorage.setItem('jwtToken', token);
        await AsyncStorage.setItem('userUid', uid);
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
        await AsyncStorage.setItem('userUid', uid);
        setAuthToken(token);
        return { uid, token, userData };
    } catch (error) {
        console.error('Error logging in:', error.response?.data || error.message);
        throw error;
    }
};

// Edit User
export const editUser = async (uid, data) => {
    try {
        const response = await axios.put(`${API_URL}/edit/${uid}`, data);
        return response.data;
    } catch (error) {
        console.error('Error editing user:', error.response?.data || error.message);
        throw error;
    }
};

// Forgot Password
export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error('Error sending password reset email:', error.response?.data || error.message);
        throw error;
    }
};

// Logout User
export const logoutUser = async () => {
    try {
        await AsyncStorage.removeItem('jwtToken');
        await AsyncStorage.removeItem('userUid');
        setAuthToken(null);
    } catch (error) {
        console.error('Error logging out:', error.message);
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
