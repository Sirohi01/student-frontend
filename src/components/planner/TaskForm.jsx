import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../../features/tasks/taskSlice';
import { getSubjects } from '../../features/subjects/subjectSlice';
import { X, Calendar, Flag, BookOpen, Type } from 'lucide-react';

const TaskForm = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');
    const [subjectId, setSubjectId] = useState('');

    const dispatch = useDispatch();
    const { subjects } = useSelector((state) => state.subjects);

    useEffect(() => {
        dispatch(getSubjects());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !dueDate || !subjectId) return;

        dispatch(createTask({ title, description, dueDate, priority, subject: subjectId }));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-card w-full max-w-lg p-0 shadow-2xl relative overflow-hidden border border-white/10">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mr-3">
                                <Type size={18} />
                            </span>
                            New Task
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="e.g. Read Chapter 4"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                <select
                                    value={subjectId}
                                    onChange={(e) => setSubjectId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input focus:outline-none appearance-none"
                                    required
                                >
                                    <option value="" className="bg-gray-800">Select Subject</option>
                                    {subjects.map((sub) => (
                                        <option key={sub._id} value={sub._id} className="bg-gray-800">{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Due Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl glass-input focus:outline-none" // [color-scheme:dark]
                                        style={{ ColorScheme: 'dark' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Priority</label>
                                <div className="relative">
                                    <Flag className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl glass-input focus:outline-none appearance-none"
                                    >
                                        <option value="low" className="bg-gray-800">Low</option>
                                        <option value="medium" className="bg-gray-800">Medium</option>
                                        <option value="high" className="bg-gray-800">High</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none min-h-[100px]"
                                placeholder="Add details..."
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Create Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskForm;
