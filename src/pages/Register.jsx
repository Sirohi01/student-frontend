import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, Loader } from 'lucide-react';
import MatrixBackground from '../components/ui/MatrixBackground';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { name, email, password, confirmPassword } = formData;
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
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            const userData = {
                name,
                email,
                password,
            };
            dispatch(register(userData));
        }
    };

    // Staggered animation for inputs
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <MatrixBackground />

            {/* Dynamic Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 border border-indigo-500/20 rounded-full animate-ping duration-[3000ms]" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-t from-pink-500/10 to-purple-500/10 rounded-full blur-[80px]" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="w-full max-w-lg z-10"
            >
                <div className="relative group">
                    {/* Dynamic Border Gradient */}
                    <div className="absolute -inset-[2px] bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

                    <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/5">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Join the Elite</h2>
                            <p className="text-gray-400 text-sm">Create your account to unlock full potential.</p>
                        </div>

                        <motion.form
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={onSubmit}
                            className="space-y-5"
                        >
                            <motion.div variants={itemVariants} className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-500 group-focus-within/input:text-pink-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="bg-black/30 w-full pl-12 p-4 rounded-xl border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-gray-500 transition-all shadow-inner"
                                    id="name"
                                    name="name"
                                    value={name}
                                    placeholder="Full Name"
                                    onChange={onChange}
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500 group-focus-within/input:text-pink-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    className="bg-black/30 w-full pl-12 p-4 rounded-xl border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-gray-500 transition-all shadow-inner"
                                    id="email"
                                    name="email"
                                    value={email}
                                    placeholder="Email Address"
                                    onChange={onChange}
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within/input:text-pink-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    className="bg-black/30 w-full pl-12 p-4 rounded-xl border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-gray-500 transition-all shadow-inner"
                                    id="password"
                                    name="password"
                                    value={password}
                                    placeholder="Password"
                                    onChange={onChange}
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within/input:text-pink-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    className="bg-black/30 w-full pl-12 p-4 rounded-xl border border-gray-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-gray-500 transition-all shadow-inner"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    placeholder="Confirm Password"
                                    onChange={onChange}
                                    required
                                />
                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)" }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transform transition-all flex justify-center items-center relative overflow-hidden group/btn"
                            >
                                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 skew-x-12" />
                                {isLoading ? <Loader className="animate-spin" /> : <>Get Started <ArrowRight className="ml-2 w-5 h-5" /></>}
                            </motion.button>
                        </motion.form>

                        <div className="mt-8 text-center pt-6 border-t border-gray-800">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-pink-500 hover:text-pink-400 font-bold hover:underline transition-all"
                                >
                                    Log In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Register;
