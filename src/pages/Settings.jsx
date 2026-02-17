import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Settings as SettingsIcon, Key, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Settings = () => {
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const { subjects } = useSelector((state) => state.subjects);
    const authState = useSelector((state) => state.auth);

    // Handle nested user object structure: { token, user: { name, email } }
    const user = authState.user?.user || authState.user;
    const token = authState.user?.token;

    const handleSaveApiKey = async (e) => {
        e.preventDefault();

        if (!apiKey.trim()) {
            toast.error('Please enter an API key');
            return;
        }

        setIsLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.post(
                'http://localhost:5000/api/v1/auth/update-api-key',
                { openaiApiKey: apiKey },
                config
            );

            toast.success('API Key saved successfully!');
            setApiKey('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save API key');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in-up max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                    <SettingsIcon className="w-8 h-8 mr-3 text-indigo-400" />
                    Settings
                </h1>
                <p className="text-gray-400">Manage your account and preferences</p>
            </div>

            {/* API Key Section */}
            <div className="glass-card p-8 mb-6">
                <div className="flex items-center mb-6">
                    <Key className="w-6 h-6 mr-3 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">OpenAI API Key</h2>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-300">
                            <p className="font-semibold mb-2">Why add your own API key?</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-200">
                                <li>Generate unlimited AI-powered flashcards</li>
                                <li>Your key is stored securely and never shared</li>
                                <li>Get $5 free credits with new OpenAI account</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSaveApiKey} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            OpenAI API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-proj-..."
                            className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Get your API key from{' '}
                            <a
                                href="https://platform.openai.com/api-keys"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 underline"
                            >
                                OpenAI Platform
                            </a>
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Save API Key
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Account Info */}
            <div className="glass-card p-8">
                <h2 className="text-xl font-bold text-white mb-6">Account Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                            {user?.name}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
                            {user?.email}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
