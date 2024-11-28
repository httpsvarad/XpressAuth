import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useauthStore from '../../store/auth.store';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

const EmailVerification = () => {
    const maskEmail = (email) => {
        if (!email) return '';
        const [localPart, domain] = email.split('@');
        const maskedLocalPart = localPart.slice(0, 2) + '*****'; // Mask all but the first 2 characters
        return `${maskedLocalPart}@${domain}`;
    };

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const {error , isLoading, verifyEmail} = useauthStore();

    // Check if all code fields are filled to enable the submit button
    const isFormComplete = code.every(digit => digit !== "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const codeString = code.join(""); 
        // console.log("Submitted code:", codeString);
        try {
            await verifyEmail(codeString);
            navigate("/");
            toast.success("Email Verified", { position: "top-right" })
        } catch (error) {
           console.log(error);  
        }

    
    };

    const handleChange = (index, value) => {
        const newCode = [...code];
        const isNumeric = /^\d$/; // Regular expression to match only single digits

        // Check if the input is a valid single digit or empty
        if (isNumeric.test(value) || value === "") {
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next input if a valid digit is entered
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className='max-w-md w-full m-7 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
            >
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                    Verify Your Email
                </h2>
                <p className='text-center text-gray-300 mb-6'>Enter the 6 digit code sent to your email address - {maskEmail(email)}</p>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='flex justify-between'>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type='text'
                                maxLength='1'
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-500 mt-2 font-semibold"> {error} </p>}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type='submit'
                        disabled={!isFormComplete} // Disable button if form is not complete
                        className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none disabled:opacity-50'
                    >
                        {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Verify Email"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EmailVerification;
