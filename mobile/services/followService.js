import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.56.2:5000/api';

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

// Helper function to get user ID from AsyncStorage
export const getUserID = async () => {
    return await getStoredUid();
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

// Search user by parameter
export const searchUser = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/users/search`, { params: { search: query } });
        return response.data;
    } catch (error) {
        console.error('Error searching user:', error);
        throw error.response ? error.response.data : error;
    }
};

// Follow a user
export const followUser = async (followedUserId) => {
    try {
        const followingUserId = await getStoredUid();
        const response = await axios.post(`${BASE_URL}/followers/createFollowers`, {
            followed_user: followedUserId,
            following_user: followingUserId,
        });
        return response.data;
    } catch (error) {
        console.error('Error following user:', error);
        throw error.response ? error.response.data : error;
    }
};

// Unfollow a user
export const unfollowUser = async (followedUserId) => {
    try {
        const followingUserId = await getStoredUid();
        const response = await axios.post(`${BASE_URL}/followers/unfollow`, {
            followed_user: followedUserId,
            following_user: followingUserId,
        });
        return response.data;
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error.response ? error.response.data : error;
    }
};

// Get followers of the current user
export const getFollowers = async () => {
    try {
        const userId = await getStoredUid();
        const response = await axios.get(`${BASE_URL}/followers/${userId}/followers`);
        return response.data.followers || [];
    } catch (error) {
        console.error('Error fetching followers:', error);
        throw error.response ? error.response.data : error;
    }
};

// Get users followed by the current user
export const getFollowing = async () => {
    try {
        const userId = await getStoredUid();
        const response = await axios.get(`${BASE_URL}/followers/${userId}/following`);
        return response.data;
    } catch (error) {
        console.error('Error fetching following:', error);
        throw error.response ? error.response.data : error;
    }
};
