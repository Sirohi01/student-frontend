import axios from '../../api/axios';

const API_URL = '/tasks/';

// Create new task
const createTask = async (taskData) => {
    const response = await axios.post(API_URL, taskData);
    return response.data.data;
};

// Get user tasks
const getTasks = async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
};

// Delete task
const deleteTask = async (taskId) => {
    const response = await axios.delete(API_URL + taskId);
    return response.data;
};

const taskService = {
    createTask,
    getTasks,
    deleteTask,
};

export default taskService;
