import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useauthStore from "../../store/auth.store";
import { toast } from "react-toastify";

const SignInPage = () => {

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [visibility, setVisibility] = useState(false)

	const { user, signin, isAuthenticated, error, isLoading } = useauthStore();
	const navigate = useNavigate();

	const toggleVisibility = () => {
		setVisibility(!visibility)
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log(email, password);
		await signin(email, password);
		navigate('/');
		toast.success("You’re now logged in", { position: "top-center" })


	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full m-7 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Welcome Back
				</h2>

				<form onSubmit={(e) => {
					handleSubmit(e)
				}}>
					<div className='relative mb-4'>
						<Mail className='absolute left-3 top-3 text-gray-400' />
						<input
							type='email'
							value={email}
							placeholder='Email Address'
							onChange={(e) => setEmail(e.target.value)}
							required
							className='w-full py-3 pl-10 bg-opacity-50 pr-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400'
						/>
					</div>

					<div className='relative mb-6'>
						<Lock className='absolute left-3 top-3 text-gray-400' />
						<input
							type={visibility ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Password'
							required
							className='w-full py-3 pl-10 bg-opacity-50 pr-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400'
						/>
						{visibility ? <Eye onClick={toggleVisibility} className='absolute cursor-pointer right-3 top-3 text-gray-400' /> : <EyeOff onClick={toggleVisibility} className='absolute cursor-pointer right-3 top-3 text-gray-400' />}
					</div>

					<div className='flex items-center mb-6'>
						<Link to='/forgot-password' className='text-sm text-green-400 hover:underline'>
							Forgot password?
						</Link>
					</div>

					{error && <p className="text-red-500 mb-2 font-semibold"> {error} </p>}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Login"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Don't have an account?{" "}
					<Link to='/signup' className='text-green-400 hover:underline'>
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default SignInPage;
