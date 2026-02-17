import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home, BookOpen, Clock, Activity, BarChart2, Menu, X, Sparkles, Zap, Settings, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const authState = useSelector((state) => state.auth);

    // Handle nested user object structure
    const user = authState.user?.user || authState.user;

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', icon: <Home size={20} />, path: '/' },
        { name: 'Study Planner', icon: <BookOpen size={20} />, path: '/planner' },
        { name: 'Focus Session', icon: <Clock size={20} />, path: '/focus' },
        { name: 'Revision', icon: <Activity size={20} />, path: '/revision' },
        { name: 'Analytics', icon: <BarChart2 size={20} />, path: '/analytics' },
        { name: 'Achievements', icon: <Trophy size={20} />, path: '/achievements' },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    const sidebarVariants = {
        hidden: { x: '-100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
        exit: { x: '-100%', opacity: 0, transition: { ease: 'easeInOut' } }
    };

    return (
        <AnimatePresence>
            {(isOpen || window.innerWidth >= 1024) && (
                <>
                    {/* Mobile Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-20 lg:hidden`}
                        onClick={toggleSidebar}
                    />

                    {/* Sidebar */}
                    <motion.div
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`fixed inset-y-0 left-0 z-30 w-72 lg:static lg:inset-auto lg:translate-x-0 h-screen`}
                    >
                        <div className="h-full m-0 lg:m-4 flex flex-col relative overflow-hidden bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-white/5 lg:border lg:rounded-3xl shadow-2xl">
                            {/* Sidebar Background Effects */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
                            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-[50px] pointer-events-none" />

                            <div className="p-8 flex items-center justify-between relative z-10">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white fill-current" />
                                    </div>
                                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                                        StudyAi
                                    </span>
                                </div>
                                <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="px-6 mb-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Welcome</p>
                                            <p className="text-sm font-medium text-gray-300">{user?.name}</p>
                                        </div>
                                        <Sparkles className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="mt-3 bg-gray-900/50 rounded-full h-2 overflow-hidden relative z-10">
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                            className={`relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${isActive
                                                ? 'text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                                                : 'text-gray-400 hover:text-gray-100'
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNavParams"
                                                    className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent border-l-2 border-indigo-500"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            )}

                                            <div className={`relative z-10 p-2 rounded-lg transition-colors ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-transparent group-hover:bg-white/5'}`}>
                                                {item.icon}
                                            </div>
                                            <span className={`relative z-10 font-bold tracking-wide ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                                {item.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-4 mt-auto relative z-10 border-t border-white/5">
                                <button
                                    onClick={onLogout}
                                    className="flex items-center w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group"
                                >
                                    <LogOut size={20} className="mr-3 group-hover:rotate-[-10deg] transition-transform" />
                                    <span className="font-bold">Disconnect</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden relative font-sans selection:bg-indigo-500/30">

            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-pink-900/10 rounded-full blur-[100px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            </div>

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />

            <main className="flex-1 lg:h-screen lg:overflow-y-auto w-full relative z-10 transition-all scroll-smooth">
                <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen">
                    <div className="lg:hidden mb-6 flex items-center justify-between glass-card p-4 rounded-2xl">
                        <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">StudyAI</div>
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
