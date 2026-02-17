import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FileText, Plus, Search, Pin, Trash2, Edit, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Notes = () => {
    const authState = useSelector((state) => state.auth);
    const { subjects } = useSelector((state) => state.subjects);
    const token = authState.user?.token;

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        subject: '',
        tags: [],
        color: '#6366f1',
    });

    useEffect(() => {
        fetchNotes();
    }, [selectedSubject]);

    const fetchNotes = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const url = selectedSubject
                ? `http://localhost:5000/api/v1/notes?subject=${selectedSubject}`
                : 'http://localhost:5000/api/v1/notes';

            const response = await axios.get(url, config);
            setNotes(response.data.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchNotes();
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(
                `http://localhost:5000/api/v1/notes/search?q=${searchTerm}`,
                config
            );
            setNotes(response.data.data);
        } catch (error) {
            toast.error('Search failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (editingNote) {
                await axios.patch(
                    `http://localhost:5000/api/v1/notes/${editingNote._id}`,
                    formData,
                    config
                );
                toast.success('Note updated!');
            } else {
                await axios.post('http://localhost:5000/api/v1/notes', formData, config);
                toast.success('Note created!');
            }

            setShowModal(false);
            setEditingNote(null);
            setFormData({ title: '', content: '', subject: '', tags: [], color: '#6366f1' });
            fetchNotes();
        } catch (error) {
            toast.error('Failed to save note');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this note?')) return;

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/v1/notes/${id}`, config);
            toast.success('Note deleted!');
            fetchNotes();
        } catch (error) {
            toast.error('Failed to delete note');
        }
    };

    const handlePin = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`http://localhost:5000/api/v1/notes/${id}/pin`, {}, config);
            fetchNotes();
        } catch (error) {
            toast.error('Failed to pin note');
        }
    };

    const openEditModal = (note) => {
        setEditingNote(note);
        setFormData({
            title: note.title,
            content: note.content,
            subject: note.subject._id,
            tags: note.tags || [],
            color: note.color || '#6366f1',
        });
        setShowModal(true);
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
                        <FileText className="w-8 h-8 mr-3 text-indigo-400" />
                        Notes
                    </h1>
                    <p className="text-gray-400">Organize your study notes</p>
                </div>

                <button
                    onClick={() => {
                        setEditingNote(null);
                        setFormData({ title: '', content: '', subject: '', tags: [], color: '#6366f1' });
                        setShowModal(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Note
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search notes..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl glass-input focus:outline-none"
                        />
                    </div>

                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="px-4 py-3 rounded-xl glass-input focus:outline-none"
                    >
                        <option value="">All Subjects</option>
                        {subjects.map((subject) => (
                            <option key={subject._id} value={subject._id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Notes Grid */}
            {notes.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No notes yet. Create your first note!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note, index) => (
                        <motion.div
                            key={note._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card p-6 hover:shadow-xl transition-all relative group"
                            style={{ borderLeft: `4px solid ${note.color}` }}
                        >
                            {note.isPinned && (
                                <Pin className="absolute top-4 right-4 w-5 h-5 text-yellow-400 fill-yellow-400" />
                            )}

                            <h3 className="text-xl font-bold text-white mb-2">{note.title}</h3>

                            {note.subject && (
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                                        {note.subject.name}
                                    </span>
                                </div>
                            )}

                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                {note.content}
                            </p>

                            {note.tags && note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {note.tags.map((tag, i) => (
                                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                <span className="text-xs text-gray-500">
                                    {new Date(note.updatedAt).toLocaleDateString()}
                                </span>

                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handlePin(note._id)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <Pin className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => openEditModal(note)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
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
                            className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingNote ? 'Edit Note' : 'New Note'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                                        placeholder="Note title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                                    >
                                        <option value="">Select subject</option>
                                        {subjects.map((subject) => (
                                            <option key={subject._id} value={subject._id}>
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        required
                                        rows={8}
                                        className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none resize-none"
                                        placeholder="Write your notes here..."
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
                                    >
                                        {editingNote ? 'Update' : 'Create'}
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

export default Notes;
