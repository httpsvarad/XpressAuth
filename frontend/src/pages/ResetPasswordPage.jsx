import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Loader, Lock, ShieldCheck } from "lucide-react";
import useauthStore from "../../store/auth.store";
import { toast } from "react-toastify";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, error, isLoading } = useauthStore();

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords Do Not Match", { position: "top-center" })
            return;
        }
        try {
            await resetPassword(token, password);

            toast.success("Password Reset Successful", { position: "top-center" })
            setTimeout(() => {
                navigate("/signin");
            }, 2000);

        } catch (error) {
            console.error(error);
            toast.error("Error, Try Again", { position: "top-center" })
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full m-7 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Reset Password
                </h2>
                {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {message && <p className="text-green-500 text-sm mb-4">{message}</p>} */}

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-4">
                        <Lock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="New Password"
                            className="w-full py-3 pl-10 bg-opacity-50 pr-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                        />
                    </div>

                    <div className="relative mb-4">
                        <ShieldCheck className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm New Password"
                            className="w-full py-3 pl-10 bg-opacity-50 pr-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                        type="submit"
                        disabled={isLoading}
                    >
                      {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Reset Password"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
};
export default ResetPasswordPage;
