import axios from '../../api/axios';

const API_URL = '/sessions/';

// Log study session
const logSession = async (sessionData) => {
    const response = await axios.post(API_URL, sessionData);
    return response.data.data;
};

// Get user sessions
const getSessions = async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
};

// Get session stats
const getStats = async () => {
    const response = await axios.get(API_URL + 'stats');
    return response.data.data;
};

const sessionService = {
    logSession,
    getSessions,
    getStats,
};

export default sessionService;
