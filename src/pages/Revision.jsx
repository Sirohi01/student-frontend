import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDueFlashcards, reviewFlashcard } from '../features/flashcards/flashcardSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, X, Brain, Plus } from 'lucide-react';
import AddFlashcardForm from '../components/planner/AddFlashcardForm';

const Revision = () => {
    const dispatch = useDispatch();
    const { flashcards, isLoading, isError, message } = useSelector((state) => state.flashcards);

    // We always show the first card in the list
    const currentCard = flashcards.length > 0 ? flashcards[0] : null;

    const [isFlipped, setIsFlipped] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getDueFlashcards());

        // DEMO: If no backend, add some sample cards for UI testing
        // Remove this after MongoDB is set up
        setTimeout(() => {
            if (flashcards.length === 0 && !isLoading) {
                console.log('No flashcards from backend, using demo data');
            }
        }, 2000);
    }, [dispatch]);

    const handleNext = (rating) => {
        if (!currentCard) return;

        let quality = 3;
        if (rating === 'hard') quality = 3;
        if (rating === 'medium') quality = 4;
        if (rating === 'easy') quality = 5;

        setIsFlipped(false);

        // Dispatch review action (this will remove card from list via extraReducers)
        // Add a small delay for animation if needed, but AnimatePresence on key change handles it
        setTimeout(() => {
            dispatch(reviewFlashcard({ id: currentCard._id, quality }));
        }, 300);
    };

    if (isLoading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!currentCard) {
        return (
            <>
                <div className="h-[80vh] flex flex-col items-center justify-center text-center p-8">
                    <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Check className="w-16 h-16 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4">All Caught Up!</h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        You've reviewed all your due flashcards for today. Great job keeping your streak alive!
                    </p>
                    <div className="flex space-x-4 mt-8">
                        <button
                            onClick={() => dispatch(getDueFlashcards())}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
                        >
                            Check Again
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Card
                        </button>
                    </div>
                </div>

                {isAddModalOpen && <AddFlashcardForm onClose={() => setIsAddModalOpen(false)} />}
            </>
        );
    }

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 border-4 border-dashed border-white/5 rounded-full animate-spin-slow" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />

            <div className="mb-8 text-center relative z-10">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 mr-3 text-indigo-400 animate-spin-slow" />
                    Spaced Repetition
                </h1>
                <p className="text-gray-400">Reviewing {flashcards.length} cards</p>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="absolute top-0 right-0 lg:right-[-150px] p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all text-white shadow-lg shadow-indigo-500/30"
                >
                    <Plus size={24} />
                </button>
            </div>

            {isAddModalOpen && <AddFlashcardForm onClose={() => setIsAddModalOpen(false)} />}

            <div className="relative w-full max-w-xl h-96 perspective-1000">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentCard._id}
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
                                <h2 className="text-3xl font-bold text-center text-white">{currentCard.front}</h2>
                                <p className="mt-8 text-sm text-gray-500">Tap to flip</p>
                                {/* Subject Tag */}
                                {currentCard.subject && (
                                    <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase font-bold text-gray-400 border border-white/10">
                                        {currentCard.subject.name}
                                    </div>
                                )}
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
                                <h2 className="text-3xl font-bold text-center text-white">{currentCard.back}</h2>

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
