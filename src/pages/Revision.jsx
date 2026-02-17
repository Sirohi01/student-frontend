import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, X, Brain } from 'lucide-react';

const Revision = () => {
    const [cards, setCards] = useState([
        { id: 1, front: "What is the mitochondria?", back: "Powerhouse of the cell", difficulty: 'easy', nextReview: '2 days' },
        { id: 2, front: "Integral of sin(x)?", back: "-cos(x) + C", difficulty: 'hard', nextReview: '10 mins' },
        { id: 3, front: "Start date of WWII?", back: "September 1, 1939", difficulty: 'medium', nextReview: '1 day' },
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = (rating) => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 300);
    };

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 border-4 border-dashed border-white/5 rounded-full animate-spin-slow" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 mr-3 text-indigo-400 animate-spin-slow" />
                    Spaced Repetition
                </h1>
                <p className="text-gray-400">Reviewing {cards.length} cards today</p>
            </div>

            <div className="relative w-full max-w-xl h-96 perspective-1000">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-full h-full relative preserve-3d cursor-pointer group"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <motion.div
                            className="absolute inset-0 w-full h-full backface-hidden"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Front of Card */}
                            <div className="w-full h-full glass-card p-10 flex flex-col items-center justify-center border-t-4 border-indigo-500 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-6 left-6 text-xs font-bold text-indigo-400 uppercase tracking-widest">Question</div>
                                <h2 className="text-3xl font-bold text-center text-white">{cards[currentIndex].front}</h2>
                                <p className="mt-8 text-sm text-gray-500">Tap to flip</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute inset-0 w-full h-full backface-hidden"
                            initial={{ rotateY: 180 }}
                            animate={{ rotateY: isFlipped ? 0 : 180 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Back of Card */}
                            <div className="w-full h-full glass-card p-10 flex flex-col items-center justify-center border-t-4 border-emerald-500 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gray-900">
                                <div className="absolute top-6 left-6 text-xs font-bold text-emerald-400 uppercase tracking-widest">Answer</div>
                                <h2 className="text-3xl font-bold text-center text-white">{cards[currentIndex].back}</h2>

                                <div className="absolute bottom-8 left-0 w-full flex justify-center space-x-4 px-8" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => handleNext('hard')} className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white font-bold transition-all border border-red-500/30">Hard</button>
                                    <button onClick={() => handleNext('medium')} className="flex-1 py-3 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white font-bold transition-all border border-amber-500/30">Good</button>
                                    <button onClick={() => handleNext('easy')} className="flex-1 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white font-bold transition-all border border-emerald-500/30">Easy</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Revision;
