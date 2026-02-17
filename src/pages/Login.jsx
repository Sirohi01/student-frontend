import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight, User } from 'lucide-react';
import MatrixBackground from '../components/ui/MatrixBackground';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        dispatch(login(userData));
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <MatrixBackground />

            {/* Ambient Gradients - Deep Dark Theme */}
            <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[5000ms]" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-[7000ms]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="w-full max-w-md relative z-10 perspective-1000"
            >
                <div className="relative group">
                    {/* Glow Effect on Hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
                        <div className="text-center mb-10">
                            <motion.h1
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-2"
                            >
                                StudyAI
                            </motion.h1>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500 group-focus-within/input:text-indigo-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full bg-gray-800/50 border border-gray-700 text-gray-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 block pl-12 p-4 placeholder-gray-500 transition-all shadow-[0_4px_20px_-1px_rgba(0,0,0,0.3)]"
                                        placeholder="name@company.com"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        required
                                    />
                                </div>

                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500 group-focus-within/input:text-indigo-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full bg-gray-800/50 border border-gray-700 text-gray-100 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 block pl-12 p-4 placeholder-gray-500 transition-all shadow-[0_4px_20px_-1px_rgba(0,0,0,0.3)]"
                                        placeholder="••••••••"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all relative overflow-hidden group/btn"
                            >
                                <span className="relative z-10 flex items-center">
                                    {isLoading ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            Sign In <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover/btn:scale-100 group-hover/btn:bg-indigo-600/50"></div>
                            </motion.button>

                            <div className="text-center mt-6">
                                <p className="text-gray-400 text-sm">
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => navigate('/register')}
                                        className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center group/link"
                                    >
                                        Sign up
                                        <span className="block max-w-0 group-hover/link:max-w-full transition-all duration-300 h-0.5 bg-indigo-400 ml-1"></span>
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* 3D decorative perspective element */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-gradient-to-br from-indigo-500 to-transparent rounded-full blur-[60px] opacity-20 animate-float pointer-events-none" />
            </motion.div>
        </div>
    );
}

export default Login;
