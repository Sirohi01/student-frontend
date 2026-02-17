import axios from '../../api/axios';

const API_URL = '/subjects/';

// Create new subject
const createSubject = async (subjectData) => {
    const response = await axios.post(API_URL, subjectData);
    return response.data.data;
};

// Get user subjects
const getSubjects = async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
};

// Delete subject
const deleteSubject = async (subjectId) => {
    const response = await axios.delete(API_URL + subjectId);
    return response.data;
};

const subjectService = {
    createSubject,
    getSubjects,
    deleteSubject,
};

export default subjectService;
