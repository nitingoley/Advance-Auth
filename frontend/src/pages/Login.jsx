import React from 'react'
import { motion } from "framer-motion";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Lock, Mail, User } from "lucide-react";
import Input from '../components/Input';
import PasswordStrength from '../components/PasswordStrength';
import { useAuthStore } from '../stores/authStore';
const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const {login , isLoading , error} = useAuthStore();
    const handleSignUp = async (e) => {
        e.preventDefault();

        await login(email , password);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
        >
            <div className='p-8'>
                <h2
                    className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-400 text text-transparent bg-clip-text'
                >Welcome Back</h2>


                <form onSubmit={handleSignUp}>


                    <Input
                        icon={Mail}
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* f orget password  */}

                    <div className='flex items-center mb-4'>
                    <Link to="/forget" 
                    className='text-sm text-blue-400 hover:underline'
                    >Forget password</Link>

                    </div>
                    {error && <p className='text-red-500 font-semibold'>{error}</p>}

                    <motion.button
                        className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                    {isLoading ? <Loader className="animate-spin mx-auto" size={24}/>: "Log in"}
                    </motion.button>

                </form>
            </div>
            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <p className='text-sm text-gray-400 gap-2'>create an account?
                    <Link style={{ padding: 6 }} to="/signup">Sign Up</Link>
                </p>
            </div>


        </motion.div>
    )
}

export default Signup
