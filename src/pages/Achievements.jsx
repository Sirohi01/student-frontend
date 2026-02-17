import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trophy, TrendingUp, Award, Flame, Clock, Star, Crown, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useState } from 'react';

const Achievements = () => {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const user = authState.user?.user || authState.user;
    const token = authState.user?.token;

    const [streak, setStreak] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const [streakRes, achievementsRes, leaderboardRes] = await Promise.all([
                axios.get('http://localhost:5000/api/v1/achievements/streak', config),
                axios.get('http://localhost:5000/api/v1/achievements/achievements', config),
                axios.get('http://localhost:5000/api/v1/achievements/leaderboard', config),
            ]);

            setStreak(streakRes.data.data);
            setAchievements(achievementsRes.data.data);
            setLeaderboard(leaderboardRes.data.data);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
                        Achievements
                    </h1>
                    <p className="text-gray-400">Track your progress and compete with others</p>
                </div>
            </div>

            {/* Streak Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <Flame className="w-8 h-8 text-orange-400 mb-3" />
                        <p className="text-gray-400 text-sm mb-1">Current Streak</p>
                        <p className="text-3xl font-black text-white">{streak?.currentStreak || 0}</p>
                        <p className="text-xs text-gray-500 mt-1">days</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <Crown className="w-8 h-8 text-purple-400 mb-3" />
                        <p className="text-gray-400 text-sm mb-1">Longest Streak</p>
                        <p className="text-3xl font-black text-white">{streak?.longestStreak || 0}</p>
                        <p className="text-xs text-gray-500 mt-1">days</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <Clock className="w-8 h-8 text-blue-400 mb-3" />
                        <p className="text-gray-400 text-sm mb-1">Total Hours</p>
                        <p className="text-3xl font-black text-white">{Math.floor(streak?.totalHours || 0)}</p>
                        <p className="text-xs text-gray-500 mt-1">hours studied</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <Target className="w-8 h-8 text-green-400 mb-3" />
                        <p className="text-gray-400 text-sm mb-1">Study Days</p>
                        <p className="text-3xl font-black text-white">{streak?.totalStudyDays || 0}</p>
                        <p className="text-xs text-gray-500 mt-1">days total</p>
                    </div>
                </motion.div>
            </div>

            {/* Achievements Grid */}
            <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Award className="w-6 h-6 mr-2 text-yellow-400" />
                    Unlocked Achievements
                </h2>

                {achievements.length === 0 ? (
                    <div className="text-center py-12">
                        <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No achievements yet. Start studying to unlock them!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 hover:border-yellow-500/40 transition-all group"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="text-4xl group-hover:scale-110 transition-transform">
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white mb-1">{achievement.title}</h3>
                                        <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Leaderboard */}
            <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-indigo-400" />
                    Leaderboard
                </h2>

                <div className="space-y-3">
                    {leaderboard.map((entry, index) => (
                        <motion.div
                            key={entry._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center justify-between p-4 rounded-xl ${entry.user?._id === user?.id
                                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
                                    : 'bg-white/5 hover:bg-white/10'
                                } transition-all`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                        index === 1 ? 'bg-gray-400 text-black' :
                                            index === 2 ? 'bg-orange-600 text-white' :
                                                'bg-gray-700 text-gray-300'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{entry.user?.name || 'Anonymous'}</p>
                                    <p className="text-sm text-gray-400">{Math.floor(entry.totalHours)} hours studied</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <div className="flex items-center space-x-1">
                                        <Flame className="w-5 h-5 text-orange-400" />
                                        <span className="text-2xl font-black text-white">{entry.currentStreak}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">day streak</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Achievements;
