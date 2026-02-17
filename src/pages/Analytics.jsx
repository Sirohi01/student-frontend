import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getStats } from '../features/studySessions/sessionSlice';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend
} from 'recharts';
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.sessions);

    useEffect(() => {
        dispatch(getStats());
    }, [dispatch]);

    // Mock data generation for demo purposes if empty
    const radarData = stats.length > 0 ? stats.map(s => ({
        subject: s.subjectName,
        focus: s.avgFocus,
        time: (s.totalDuration / 60) * 10,  // Normalized
        completion: Math.floor(Math.random() * 40) + 60 // Mock completion
    })) : [
        { subject: 'Math', focus: 80, time: 90, completion: 70 },
        { subject: 'Physics', focus: 65, time: 60, completion: 85 },
        { subject: 'History', focus: 90, time: 40, completion: 95 },
        { subject: 'Chem', focus: 50, time: 70, completion: 60 },
    ];

    const trendData = [
        { day: 'Mon', hours: 2.5, focus: 70 },
        { day: 'Tue', hours: 3.8, focus: 85 },
        { day: 'Wed', hours: 1.5, focus: 60 },
        { day: 'Thu', hours: 4.2, focus: 90 },
        { day: 'Fri', hours: 5.0, focus: 95 },
        { day: 'Sat', hours: 3.0, focus: 75 },
        { day: 'Sun', hours: 2.0, focus: 80 },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white mb-2">Deep Analytics</h1>
                    <p className="text-gray-400">AI-driven insights into your learning patterns.</p>
                </div>
                <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl text-indigo-400">
                    <Brain className="w-5 h-5" />
                    <span className="font-bold text-sm">AI Analysis: Active</span>
                </div>
            </div>

            {/* AI Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 border-l-4 border-l-emerald-500"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Peak Performance</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                You perform 35% better during morning sessions (8 AM - 11 AM). Consider scheduling complex subjects like <span className="text-emerald-400 font-bold">Physics</span> then.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ... Add more cards ... */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 border-l-4 border-l-amber-500"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Attention Drift</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Focus drops significantly after 45 minutes. Recommended strategy: <span className="text-amber-400 font-bold">Pomodoro (25/5)</span> for next session.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 border-l-4 border-l-indigo-500"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1">Subject Mastery</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Your <span className="text-indigo-400 font-bold">History</span> retention rate is high. You can reduce review frequency for this subject.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Detailed Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 h-[500px]">
                    <h2 className="text-xl font-bold text-white mb-6">Subject Balance Radar</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#374151" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4B5563" />
                            <Radar name="Focus Score" dataKey="focus" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                            <Radar name="Time Invested" dataKey="time" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
                            <Legend />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-card p-8 h-[500px]">
                    <h2 className="text-xl font-bold text-white mb-6">Weekly Learning Velocity</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} dy={10} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                            />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 8 }} name="Study Hours" />
                            <Line yAxisId="right" type="monotone" dataKey="focus" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} name="Focus Score" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
