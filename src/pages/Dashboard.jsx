import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getStats } from '../features/studySessions/sessionSlice';
import { getTasks } from '../features/tasks/taskSlice';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { Activity, Clock, Book, TrendingUp, Sparkles, Zap, Target, Trophy, ArrowUpRight, BarChart as BarChartIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const { stats, isLoading } = useSelector((state) => state.sessions);
    const { tasks } = useSelector((state) => state.tasks);

    // Handle nested user object structure
    const user = authState.user?.user || authState.user;
    const token = authState.user?.token;

    const [streak, setStreak] = useState(null);

    useEffect(() => {
        dispatch(getStats());
        dispatch(getTasks());

        // Fetch streak data
        const fetchStreak = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await axios.get('http://localhost:5000/api/v1/achievements/streak', config);
                setStreak(response.data.data);
            } catch (error) {
                console.error('Error fetching streak:', error);
            }
        };

        if (token) {
            fetchStreak();
        }
    }, [dispatch, token]);

    // Transform stats for charts
    const chartData = stats.map(stat => ({
        name: stat.subjectName,
        hours: Math.round((stat.totalDuration / 60) * 10) / 10,
        focus: Math.round(stat.avgFocus),
        color: stat.color
    }));

    const totalStudyTime = stats.reduce((acc, curr) => acc + curr.totalDuration, 0);
    const totalHours = Math.floor(totalStudyTime / 60);
    const totalMinutes = totalStudyTime % 60;

    const avgFocus = stats.length > 0
        ? Math.round(stats.reduce((acc, curr) => acc + curr.avgFocus, 0) / stats.length)
        : 0;

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: { delay: i * 0.1, type: "spring", stiffness: 100 }
        })
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Hero Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative group rounded-3xl overflow-hidden glass-card p-8 border border-white/10"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none animate-pulse" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end">
                    <div>
                        <div className="flex items-center space-x-2 text-indigo-400 mb-2 font-bold tracking-wider text-xs uppercase">
                            <Zap className="w-4 h-4 fill-current" />
                            <span>System Online</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-gray-400 max-w-lg text-lg">
                            Your neural network is optimized. Ready to enhance your cognitive parameters?
                        </p>
                    </div>

                    <div className="mt-6 md:mt-0 flex space-x-4">
                        <div className="text-right">
                            <p className="text-xs text-gray-500 font-bold uppercase">Current Streak</p>
                            <p className="text-2xl font-bold text-white flex items-center justify-end">
                                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                                {streak?.currentStreak || 0} Days
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    i={0}
                    icon={<Clock className="text-indigo-400" />}
                    title="Total Study Time"
                    value={`${totalHours}h ${totalMinutes}m`}
                    subtitle="+2.5h this week"
                    color="indigo"
                    chart={[40, 30, 60, 50, 80, 65, 90]}
                />
                <StatCard
                    i={1}
                    icon={<Activity className="text-pink-400" />}
                    title="Focus Efficiency"
                    value={`${avgFocus}%`}
                    subtitle="Top 10% of users"
                    color="pink"
                    chart={[65, 70, 68, 75, 80, 85, 82]}
                />
                <StatCard
                    i={2}
                    icon={<Book className="text-emerald-400" />}
                    title="Active Subjects"
                    value={stats.length}
                    subtitle="Keep diversifying"
                    color="emerald"
                    chart={[2, 2, 3, 3, 4, 4, 5]}
                />
                <StatCard
                    i={3}
                    icon={<Target className="text-amber-400" />}
                    title="Task Completion"
                    value={`${taskCompletionRate}%`}
                    subtitle={`${completedTasks} / ${totalTasks} tasks`}
                    color="amber"
                    chart={[20, 40, 30, 50, 60, 80, 75]}
                />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6 h-[450px] relative group overflow-hidden border border-white/5"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <BarChartIcon className="w-5 h-5 mr-3 text-indigo-400" />
                            Time Distribution
                        </h2>
                        <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400">Weekly</div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barGap={8}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-gray-900/95 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
                                                    <p className="text-white font-bold mb-1">{label}</p>
                                                    <p className="text-indigo-400 text-sm font-medium">
                                                        {payload[0].value} hours
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="hours"
                                    radius={[8, 8, 8, 8]}
                                    barSize={40}
                                    fill="url(#barGradient)"
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6 h-[450px] relative group overflow-hidden border border-white/5"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Activity className="w-5 h-5 mr-3 text-pink-400" />
                            Focus Depth
                        </h2>
                        <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400">Live</div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-gray-900/95 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
                                                    <p className="text-white font-bold mb-1">{label}</p>
                                                    <p className="text-pink-400 text-sm font-medium">
                                                        {payload[0].value}% Focus
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="focus"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorFocus)"
                                    animationDuration={1500}
                                    dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, stroke: '#ec4899', strokeWidth: 0, fill: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Mini Sparkline component (simulated)
const MiniChart = ({ data, color }) => {
    const colorMap = {
        indigo: '#818cf8',
        pink: '#f472b6',
        emerald: '#34d399',
        amber: '#fbbf24'
    };

    // Very simplified SVG path for demonstration
    // In production, use D3 or Recharts specific Sparkline
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 60;
        const y = 30 - ((val - min) / range) * 30;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width="60" height="30" viewBox="0 0 60 30" className="opacity-50 group-hover:opacity-100 transition-opacity">
            <polyline
                fill="none"
                stroke={colorMap[color]}
                strokeWidth="2"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const StatCard = ({ i, icon, title, value, subtitle, color, chart }) => {
    const bgColors = {
        indigo: 'bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/10 hover:border-indigo-500/20',
        pink: 'bg-pink-500/5 hover:bg-pink-500/10 border-pink-500/10 hover:border-pink-500/20',
        emerald: 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/10 hover:border-emerald-500/20',
        amber: 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/10 hover:border-amber-500/20',
    };

    const textColors = {
        indigo: 'text-indigo-400',
        pink: 'text-pink-400',
        emerald: 'text-emerald-400',
        amber: 'text-amber-400',
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-3xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group ${bgColors[color]}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors shadow-inner`}>
                    {icon}
                </div>
                {chart && <MiniChart data={chart} color={color} />}
            </div>

            <div>
                <p className={`text-4xl font-black tracking-tighter text-white mb-1`}>{value}</p>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 font-medium tracking-wide">{title}</p>
                    <span className={`text-xs font-bold ${textColors[color]} flex items-center bg-white/5 px-2 py-0.5 rounded-lg`}>
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {Math.floor(Math.random() * 20)}%
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">{subtitle}</p>
            </div>
        </motion.div>
    );
};

export default Dashboard;
