import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Target, Plus, Trash2, Trophy, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Goals = () => {
    const authState = useSelector((state) => state.auth);
    const token = authState.user?.token;

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('active');

    const [formData, setFormData] = useState({
        type: 'daily',
        title: '',
        description: '',
        targetType: 'hours',
        targetValue: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchGoals();
    }, [filter]);

    const fetchGoals = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const url = filter === 'active'
                ? 'http://localhost:5000/api/v1/goals?active=true'
                : 'http://localhost:5000/api/v1/goals';

            const response = await axios.get(url, config);
            setGoals(response.data.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
            toast.error('Failed to fetch goals');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/v1/goals', formData, config);
            toast.success('Goal created!');
            setShowModal(false);
            setFormData({
                type: 'daily',
                title: '',
                description: '',
                targetType: 'hours',
                targetValue: 1,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            });
            fetchGoals();
        } catch (error) {
            toast.error('Failed to create goal');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this goal?')) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/v1/goals/${id}`, config);
            toast.success('Goal deleted!');
            fetchGoals();
        } catch (error) {
            toast.error('Failed to delete goal');
        }
    };

    const getProgress = (goal) => {
        return Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
    };

    const getTargetLabel = (type) => {
        const labels = {
            hours: 'hours',
            sessions: 'sessions',
            tasks: 'tasks',
            flashcards: 'flashcards',
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <Target className="w-8 h-8 mr-3 text-green-400" />
                        Goals
                    </h1>
                    <p className="text-gray-400">Set and track your study goals</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/25 flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Goal
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-4">
                <button
                    onClick={() => setFilter('active')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'active'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    Active Goals
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${filter === 'all'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                >
                    All Goals
                </button>
            </div>

            {/* Goals Grid */}
            {goals.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No goals yet. Create your first goal!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal, index) => {
                        const progress = getProgress(goal);
                        const isCompleted = goal.isCompleted;

                        return (
                            <motion.div
                                key={goal._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`glass-card p-6 relative overflow-hidden ${isCompleted ? 'border-2 border-green-500/50' : ''
                                    }`}
                            >
                                {isCompleted && (
                                    <div className="absolute top-4 right-4">
                                        <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${goal.type === 'daily' ? 'bg-blue-500/20 text-blue-300' :
                                                    goal.type === 'weekly' ? 'bg-purple-500/20 text-purple-300' :
                                                        'bg-orange-500/20 text-orange-300'
                                                }`}>
                                                {goal.type}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                                                {getTargetLabel(goal.targetType)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
                                        {goal.description && (
                                            <p className="text-sm text-gray-400">{goal.description}</p>
                                        )}
                                    </div>

                                    {!isCompleted && (
                                        <button
                                            onClick={() => handleDelete(goal._id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    )}
                                </div>

                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-400">Progress</span>
                                        <span className="text-sm font-bold text-white">
                                            {goal.currentValue} / {goal.targetValue} {getTargetLabel(goal.targetType)}
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className={`h-full rounded-full ${isCompleted
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                                                }`}
                                        />
                                    </div>
                                    <div className="text-right mt-1">
                                        <span className="text-xs font-bold text-white">{progress}%</span>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {new Date(goal.startDate).toLocaleDateString()}
                                    </div>
                                    <div>
                                        to {new Date(goal.endDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card p-8 max-w-2xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Create New Goal</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Target Type</label>
                                        <select
                                            value={formData.targetType}
                                            onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                                        >
                                            <option value="hours">Study Hours</option>
                                            <option value="sessions">Study Sessions</option>
                                            <option value="tasks">Tasks</option>
                                            <option value="flashcards">Flashcards</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                                        placeholder="e.g., Study 5 hours this week"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Target Value</label>
                                    <input
                                        type="number"
                                        value={formData.targetValue}
                                        onChange={(e) => setFormData({ ...formData, targetValue: parseInt(e.target.value) })}
                                        required
                                        min="1"
                                        className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/25"
                                    >
                                        Create Goal
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Goals;
