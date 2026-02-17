import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSubjects } from '../features/subjects/subjectSlice';
import { logSession, reset } from '../features/studySessions/sessionSlice';
import { Play, Pause, Square, RotateCcw, Volume2, VolumeX, Maximize2, Minimize2, Save, Brain, Zap, Coffee, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Focus = () => {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0); // Total seconds elapsed
    const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 min for Pomodoro
    const [mode, setMode] = useState('timer'); // 'timer' (countdown) or 'stopwatch' (countup)
    const [selectedSubject, setSelectedSubject] = useState('');
    const [sessionType, setSessionType] = useState('pomodoro'); // pomodoro, short-break, long-break, deep-work
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Audio refs
    const tickSound = useRef(null);
    const alarmSound = useRef(null);

    const dispatch = useDispatch();
    const { subjects } = useSelector((state) => state.subjects);
    const { isSuccess, isError, message } = useSelector((state) => state.sessions);

    // Constants
    const MODES = {
        'pomodoro': { time: 25 * 60, color: 'indigo', label: 'Focus' },
        'short-break': { time: 5 * 60, color: 'emerald', label: 'Short Break' },
        'long-break': { time: 15 * 60, color: 'blue', label: 'Long Break' },
        'deep-work': { time: 60 * 60, color: 'pink', label: 'Deep Work' },
    };

    useEffect(() => {
        dispatch(getSubjects());
    }, [dispatch]);

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                if (mode === 'timer') {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setIsActive(false);
                            playAlarm();
                            toast.success("Session Completed! Take a break.");
                            return 0;
                        }
                        return prev - 1;
                    });
                    setSeconds((prev) => prev + 1); // Track total time anyway
                } else {
                    setSeconds((prev) => prev + 1);
                }
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, seconds, mode]);

    const toggleTimer = () => {
        if (!selectedSubject && mode === 'timer') {
            toast.error("Please select a subject first!");
            return;
        }
        setIsActive(!isActive);
        if (!isActive && !isMuted) {
            // playTick(); // Optional: Start ambient sound
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[sessionType].time);
        setSeconds(0);
    };

    const switchMode = (type) => {
        setIsActive(false);
        setSessionType(type);
        setTimeLeft(MODES[type].time);
        setSeconds(0);
    };

    const handleSaveSession = () => {
        if (seconds < 60) {
            toast.warn("Session too short to save (min 1 min)");
            return;
        }
        if (!selectedSubject) {
            toast.error("Select a subject to save session");
            return;
        }

        const sessionData = {
            subject: selectedSubject,
            startTime: new Date(Date.now() - seconds * 1000).toISOString(),
            endTime: new Date().toISOString(),
            duration: Math.floor(seconds / 60), // minutes
            focusScore: Math.floor(Math.random() * (100 - 60 + 1) + 60), // AI simulated score for now
        };

        dispatch(logSession(sessionData));
        toast.success("Session saved successfully!");
        resetTimer();
    };

    const playAlarm = () => {
        // Logic for playing alarm
        // new Audio('/alarm.mp3').play();
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Circular Progress Calculation
    const totalTime = MODES[sessionType].time;
    const progress = mode === 'timer' ? ((totalTime - timeLeft) / totalTime) * 100 : 100;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const currentColor = MODES[sessionType].color;

    // Explicit mappings for Tailwind JIT
    const glowColors = {
        indigo: 'bg-indigo-500',
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        pink: 'bg-pink-500'
    };

    const colorMap = {
        indigo: 'stroke-indigo-500 text-indigo-500 shadow-indigo-500/50',
        emerald: 'stroke-emerald-500 text-emerald-500 shadow-emerald-500/50',
        blue: 'stroke-blue-500 text-blue-500 shadow-blue-500/50',
        pink: 'stroke-pink-500 text-pink-500 shadow-pink-500/50',
    };

    const activeBorderColors = {
        indigo: 'bg-indigo-500/20 border-indigo-500/50',
        emerald: 'bg-emerald-500/20 border-emerald-500/50',
        blue: 'bg-blue-500/20 border-blue-500/50',
        pink: 'bg-pink-500/20 border-pink-500/50'
    };

    const activeDotColors = {
        indigo: 'bg-indigo-500',
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        pink: 'bg-pink-500'
    };

    return (
        <div className={`min-h-[80vh] flex flex-col items-center justify-center relative transition-all duration-700 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#050505] p-10' : ''}`}>

            {/* Ambient Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 transition-colors duration-1000 pointer-events-none ${isActive ? glowColors[currentColor] : 'bg-gray-500'
                }`} />

            <div className="w-full max-w-4xl z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

                {/* Left Controls */}
                <div className="glass-card p-6 order-2 lg:order-1 space-y-6">
                    <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-4">Focus Modes</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {Object.keys(MODES).map((type) => (
                            <button
                                key={type}
                                onClick={() => switchMode(type)}
                                className={`flex items-center p-3 rounded-xl transition-all border ${sessionType === type
                                    ? `${activeBorderColors[MODES[type].color]} text-white`
                                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full mr-3 ${sessionType === type ? activeDotColors[MODES[type].color] : 'bg-gray-600'}`} />
                                <span className="font-medium text-sm">{MODES[type].label}</span>
                                <span className="ml-auto text-xs opacity-50">{Math.floor(MODES[type].time / 60)}m</span>
                            </button>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Target Subject</label>
                        <div className="relative">
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                                ))}
                            </select>
                            <Brain className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Main Timer Display */}
                <div className="order-1 lg:order-2 flex flex-col items-center justify-center">
                    <div className="relative group cursor-pointer" onClick={toggleTimer}>
                        {/* SVG Timer Ring */}
                        <svg className="w-80 h-80 transform -rotate-90 drop-shadow-2xl">
                            {/* Background Circle */}
                            <circle
                                cx="160"
                                cy="160"
                                r={radius}
                                fill="transparent"
                                stroke="#1f2937"
                                strokeWidth="8"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="160"
                                cy="160"
                                r={radius}
                                fill="transparent"
                                className={`transition-all duration-1000 ease-linear ${colorMap[MODES[sessionType].color].split(' ')[0]}`}
                                strokeWidth="8"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* Time Display */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className={`text-6xl font-black tracking-tighter tabular-nums text-white`}>
                                {formatTime(mode === 'timer' ? timeLeft : seconds)}
                            </div>
                            <p className={`mt-2 font-medium tracking-widest uppercase text-sm ${isActive ? 'animate-pulse text-white' : 'text-gray-500'}`}>
                                {isActive ? 'Focusing...' : 'Ready'}
                            </p>
                        </div>

                        {/* Play/Pause Overlay */}
                        {!isActive && timeLeft !== 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Play size={48} className="text-white fill-current" />
                            </div>
                        )}
                    </div>

                    {/* Primary Actions */}
                    <div className="flex items-center space-x-6 mt-10">
                        <button
                            onClick={toggleTimer}
                            className={`p-4 rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-xl ${isActive
                                ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                                : 'bg-white text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                        </button>

                        <button
                            onClick={handleSaveSession}
                            disabled={seconds < 30}
                            className="p-4 rounded-full bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Save size={28} />
                        </button>

                        <button
                            onClick={resetTimer}
                            className="p-4 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                        >
                            <RotateCcw size={28} />
                        </button>
                    </div>
                </div>

                {/* Right Stats/Tools */}
                <div className="glass-card p-6 order-3 space-y-6 h-full">
                    <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-4">Session Stats</h3>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Clock className="text-indigo-400" size={18} />
                                <span className="text-gray-300 text-sm">Elapsed</span>
                            </div>
                            <span className="font-mono text-lg font-bold">{formatTime(seconds)}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Zap className="text-yellow-400" size={18} />
                                <span className="text-gray-300 text-sm">Est. Score</span>
                            </div>
                            <span className="font-mono text-lg font-bold text-yellow-500">
                                {seconds > 300 ? '92' : seconds > 60 ? '85' : '--'}
                            </span>
                        </div>

                        <div className="pt-6 mt-6 border-t border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-gray-500 uppercase">Environment</span>
                            </div>
                            <div className="flex justify-between">
                                <button onClick={() => setIsMuted(!isMuted)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>
                                <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Focus;
