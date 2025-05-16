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

// Posts Service
export const createPost = async (caption, allowedComment, imageURL, location) => {
    const userID = await getUserID();
    const response = await axios.post(`${BASE_URL}/posts/createPosts`, {
        UserID: userID,
        Caption: caption,
        allowedComment : allowedComment,
        ImageURL: imageURL,
        Location: location,
    });
    return response.data;
};

export const getAllPosts = async () => {
    const response = await axios.get(`${BASE_URL}/posts/`);
    return response.data;
};

export const getAllPostsUser = async () => {
    try {
        const userID = await getUserID();
        const route = `${BASE_URL}/posts/${userID}`;
        console.log('Route for getAllPostsUser:', route);
        const response = await axios.get(route);
        console.log('Response from getAllPostsUser:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts by user auth:', error.message);
        throw error.response ? error.response.data : error;
    }
};

export const updatePost = async (postId, caption, imageURL, location) => {
    const userID = await getUserID();
    const response = await axios.put(`${BASE_URL}/posts/updatePost/${postId}`, {
        UserID: userID,
        Caption: caption,
        ImageURL: imageURL,
        Location: location,
    });
    return response.data;
};

export const deletePost = async (postId) => {
    const response = await axios.delete(`${BASE_URL}/posts/delete/${postId}`);
    return response.data;
};

// Likes Service
export const likePost = async (postId) => {
    const userID = await getUserID();
    console.log('Sending data to database:', {
        PostID: postId,
        UserID: userID,
    });
    const response = await axios.post(`${BASE_URL}/likePost/createLike`, {
        PostID: postId,
        UserID: userID,
    });
    return response.data;
};

export const getLikedByUsers = async (postId) => {
    const response = await axios.get(`${BASE_URL}/likePost/likedBy/${postId}`);
    const data = response.data;

    const postCount = data.reduce((count, item) => {
        if (item.PostID === postId) {
            count++;
        }
        return count;
    }, 0);

    return { data, postCount };
};

export const unlikePost = async (postId) => {
    const userID = await getUserID();
    const response = await axios.delete(`${BASE_URL}/likePost/unlike`, {
        data: {
            PostID: postId,
            UserID: userID,
        },
    });
    return response.data;
};

// Comments Service
export const createComment = async (postId, comment) => {
    const userID = await getUserID();
    console.log('Sending data to database:', {
        PostID: postId,
        UserID: userID,
        Comment: comment,
    });
    const response = await axios.post(`${BASE_URL}/comment/create`, {
        PostID: postId,
        UserID: userID,
        Comment: comment,
    });
    return response.data;
};

export const getCommentsByPost = async (postId) => {
    try {
        const response = await axios.get(`${BASE_URL}/comment/byPost/${postId}`);
        const { success, comments } = response.data;

        if (!success) {
            throw new Error('Failed to retrieve comments');
        }

        const commentCount = comments.length;

        return { data: comments, commentCount };
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        throw error.response ? error.response.data : error;
    }
};
