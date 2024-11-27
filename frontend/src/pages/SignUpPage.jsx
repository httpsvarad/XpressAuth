import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import useauthStore from "../../store/auth.store";
import validator from "email-validator";


const SignUpPage = () => {


    const [passstrength, setPassstrength] = useState(0);
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const { signup, error, isLoading } = useauthStore();
    const navigate = useNavigate();

    function handlePassStrength(value) {
        setPassstrength(value);

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const checkValidEmail = validator.validate(email);
        if (!checkValidEmail) {
            toast.error("Enter a VALID email", { position: "top-right" })
            // alert('Enter a Valid Email')
            return;
        }
        if (passstrength < 4) {
            toast.error("Create a STRONG password", { position: "top-right" })
            // alert('Set a STRONG password')
            return;
        }
        try {
            await signup(email, password, name);
            navigate('/verify-email', { state: { email } });
        } catch (error) {
            console.log(error);

        }


    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md m-7 w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Create Account
                </h2>

                <form onSubmit={(e) => {
                    handleSubmit(e);

                }}>
                    {/* Full Name Input */}
                    <div className="relative mb-4">
                        <User className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            required
                            onChange={(e) => { setName(e.target.value) }}
                            className="w-full py-3 pl-10 bg-opacity-50 pr-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                        />
                    </div>

                    {/* Email Address Input */}
                    <div className="relative mb-4">
                        <Mail className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            placeholder="Email Address"
                            required
                            className="w-full py-3 pl-10 bg-opacity-50 pr-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative mb-4">
                        <Lock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            required
                            placeholder="Password"
                            className="w-full py-3 pl-10 bg-opacity-50 pr-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                        />
                    </div>

                    {error && <p className="text-red-500 mt-2 font-semibold"> {error} </p>}

                    {/* Password Strength Meter */}
                    <PasswordStrengthMeter password={password} handleStrength={handlePassStrength} />

                    {/* Sign Up Button */}
                    <motion.button
                        className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                        font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Sign Up"}
                    </motion.button>
                </form>
            </div>

            {/* Footer Section */}
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link to={"/signin"} className="text-green-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </motion.div>
    );
};

export default SignUpPage;
