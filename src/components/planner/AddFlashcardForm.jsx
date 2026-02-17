import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFlashcard } from '../../features/flashcards/flashcardSlice';
import { getSubjects } from '../../features/subjects/subjectSlice';
import { X, Save, Brain, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';

const AddFlashcardForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        subjectId: '',
        front: '',
        back: '',
    });
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const dispatch = useDispatch();
    const { subjects } = useSelector((state) => state.subjects);
    const { user } = useSelector((state) => state.auth);

    // Fetch subjects if not available
    useEffect(() => {
        if (subjects.length === 0) {
            dispatch(getSubjects());
        }
    }, [dispatch, subjects.length]);

    const { subjectId, front, back } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAIGenerate = async () => {
        if (!subjectId || !topic) {
            toast.error('Please select a subject and enter a topic');
            return;
        }

        const selectedSubject = subjects.find(s => s._id === subjectId);
        if (!selectedSubject) return;

        setIsGenerating(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const response = await axios.post(
                'http://localhost:5000/api/v1/ai/generate-flashcards',
                {
                    subject: selectedSubject.name,
                    topic: topic,
                    count: 5
                },
                config
            );

            const flashcards = response.data.data;

            // Create all generated flashcards
            if (Array.isArray(flashcards)) {
                for (const card of flashcards) {
                    await dispatch(createFlashcard({
                        subjectId,
                        front: card.front,
                        back: card.back
                    })).unwrap();
                }
                toast.success(`Generated ${flashcards.length} flashcards!`);
                onClose();
            } else {
                toast.error('Invalid response format');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate flashcards');
        } finally {
            setIsGenerating(false);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!subjectId || !front || !back) {
            toast.error('Please fill all fields');
            return;
        }

        dispatch(createFlashcard(formData))
            .unwrap()
            .then(() => {
                toast.success("Flashcard Created!");
                setFormData({ subjectId: '', front: '', back: '' });
                onClose();
            })
            .catch(err => {
                toast.error(err);
            });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Brain className="w-5 h-5 mr-2 text-indigo-400" />
                        Add Flashcard
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    {/* AI Generation Section */}
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl">
                        <div className="flex items-center mb-3">
                            <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                            <h3 className="text-sm font-bold text-purple-300">AI-Powered Generation</h3>
                        </div>

                        <div className="space-y-3">
                            <select
                                value={subjectId}
                                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none text-sm"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((sub) => (
                                    <option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter topic (e.g., Photosynthesis, Quadratic Equations)"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm placeholder-gray-500"
                            />

                            <button
                                type="button"
                                onClick={handleAIGenerate}
                                disabled={isGenerating || !subjectId || !topic}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate 5 Cards with AI
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-white/10"></div>
                        <span className="px-3 text-xs text-gray-500 uppercase">Or Create Manually</span>
                        <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                        <select
                            name="subjectId"
                            value={subjectId}
                            onChange={onChange}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                        >
                            <option value="">Select Subject</option>
                            {subjects.map((sub) => (
                                <option key={sub._id} value={sub._id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Question (Front)</label>
                        <textarea
                            name="front"
                            value={front}
                            onChange={onChange}
                            rows="2"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                            placeholder="e.g. What is the mitochondria?"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Answer (Back)</label>
                        <textarea
                            name="back"
                            value={back}
                            onChange={onChange}
                            rows="3"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                            placeholder="Powerhouse of the cell..."
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Save Flashcard
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddFlashcardForm;
