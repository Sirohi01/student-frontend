import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSubject, getSubjects, deleteSubject } from '../../features/subjects/subjectSlice';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';

const COLORS = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#14b8a6', // Teal
];

const SubjectManager = () => {
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    const dispatch = useDispatch();
    const { subjects, isLoading, isError, message } = useSelector(
        (state) => state.subjects
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        dispatch(getSubjects());
    }, [isError, message, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            toast.error('Please enter a subject name');
            return;
        }
        dispatch(createSubject({ name, color: selectedColor }));
        setName('');
    };

    return (
        <div className="glass-card p-6 h-full relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-pink-500/20 rounded-full blur-[50px] pointer-events-none group-hover:bg-pink-500/30 transition-all duration-700" />

            <h2 className="text-xl font-bold text-white mb-6 flex items-center relative z-10">
                <BookOpen className="w-5 h-5 mr-3 text-pink-400" />
                Subjects
            </h2>

            <form onSubmit={onSubmit} className="mb-8 space-y-4 relative z-10">
                <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">
                        New Subject
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mathematics"
                        className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Code Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full transition-all hover:scale-110 focus:outline-none ring-2 ring-offset-2 ring-offset-gray-900 ${selectedColor === color ? 'ring-white scale-110' : 'ring-transparent opacity-70 hover:opacity-100'
                                    }`}
                                style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 font-medium"
                    disabled={isLoading}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Subject
                </button>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {subjects.length > 0 ? (
                    subjects.map((subject) => (
                        <div
                            key={subject._id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item"
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                                    style={{ backgroundColor: subject.color, color: subject.color }}
                                />
                                <span className="font-medium text-gray-200">
                                    {subject.name}
                                </span>
                            </div>
                            <button
                                onClick={() => dispatch(deleteSubject(subject._id))}
                                className="text-gray-500 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all p-1 hover:bg-white/10 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p className="text-gray-400 text-sm">No subjects yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectManager;
