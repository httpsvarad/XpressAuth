import React from 'react'
import { motion } from "framer-motion";
import useauthStore from '../../store/auth.store';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const WelcomePage = ({ user }) => {

    const { signout, isLoading } = useauthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signout();
        navigate('/signin')

    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-800 bg-opacity-50 m-7 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Hey, {user.name} !
                </h2>
                <p className="text-center text-gray-300 mb-6">
                    Happiness looks good on you. Keep wearing it 😇
                </p>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                    onClick={handleLogout}
                >
                    {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Logout"}
                </motion.button>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <p className="text-sm text-gray-400">Thanks for using XpressAuth</p>
            </div>
        </motion.div>
    )
}

export default WelcomePage