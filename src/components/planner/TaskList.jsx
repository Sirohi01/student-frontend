import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks, deleteTask } from '../../features/tasks/taskSlice';
import { getSubjects } from '../../features/subjects/subjectSlice';
import { CheckCircle, Clock, Calendar, Flag, Trash2, Plus, Filter } from 'lucide-react';
import TaskForm from './TaskForm';

const TaskList = () => {
    const dispatch = useDispatch();
    const { tasks, isLoading } = useSelector((state) => state.tasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        dispatch(getTasks());
        dispatch(getSubjects());
    }, [dispatch]);

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden">
            <div className="absolute bottom-[-10%] right-[-5%] w-60 h-60 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-indigo-400" />
                    My Tasks
                </h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 relative z-10">
                {['all', 'todo', 'in-progress', 'completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${filter === status
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/25'
                            : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {status.replace('-', ' ')}
                    </button>
                ))}
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2 relative z-10" style={{ maxHeight: '600px' }}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                ) : filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div
                            key={task._id}
                            className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all hover:translate-x-1"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-start space-x-3">
                                    <div
                                        className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor]`}
                                        style={{ backgroundColor: task.subject?.color || '#666', color: task.subject?.color || '#666' }}
                                    />
                                    <div>
                                        <h3 className="font-semibold text-white line-clamp-1">{task.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{task.subject?.name || 'No Subject'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => dispatch(deleteTask(task._id))}
                                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1.5 hover:bg-white/10 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-3 pl-5">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                                        <Calendar className="w-3 h-3 mr-1.5" />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                    <div className={`flex items-center px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                                        <Flag className="w-3 h-3 mr-1.5" />
                                        {task.priority}
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${task.status === 'completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                                    task.status === 'in-progress' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-gray-400 bg-gray-500/10 border-gray-500/20'
                                    }`}>
                                    {task.status.replace('-', ' ')}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                            <Filter className="w-8 h-8 text-indigo-400 opacity-50" />
                        </div>
                        <p className="text-gray-300">No tasks found.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-medium hover:underline"
                        >
                            Create new task
                        </button>
                    </div>
                )}
            </div>

            {isModalOpen && <TaskForm onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default TaskList;
