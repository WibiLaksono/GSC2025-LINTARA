// services/leaderboardService.ts
import axios from 'axios';

const BASE_URL = 'http://192.168.56.2:5000/api';

export const getReportsCountByUser = async () => {
    try {
        const url = `${BASE_URL}/reports/getReportsCountByUser`;
        console.log(`Requesting: GET ${url}`);
        const response = await axios.get(url);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching report counts by user:", error);
        return [];
    }
};