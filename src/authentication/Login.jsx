import phone from "../assets/loginPhoto.jpg"
import { Link } from "react-router-dom"
import { useState } from "react"

const Login = () => {
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);

    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 w-full min-h-screen p-4 sm:p-6 md:p-9">
            <div className="flex flex-col md:flex-row justify-items-center rounded-xl border border-gray-200 w-full max-w-4xl shadow-lg bg-white">
                <div className="w-full md:w-[40%] h-40 md:h-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    <img
                        src={phone}
                        alt="female therapist"
                        className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                    />
                </div>
                <div className="w-full md:w-[60%] p-8 md:p-10">
                    <div className="w-full space-y-4">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-sans text-2xl md:text-3xl font-bold tracking-wide">
                            Anonymous Therapy
                        </span>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold text-gray-800">
                                Welcome back!
                            </h1>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We're glad to see you again. Please sign in to continue your journey.
                            </p>
                        </div>
                    </div>
                    <form className="max-w-sm mx-auto mt-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input 
                                        type="Email"
                                        name="Email"
                                        className="w-full h-12 pl-4 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                        placeholder="Enter your email"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input 
                                        type="password"
                                        name="password"
                                        className="w-full h-12 pl-4 pr-10 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center pt-4">
                                <button 
                                    type='submit' 
                                    className="text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full md:w-2/3 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 space-y-4 text-center">
                            <Link 
                                to="/" 
                                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors inline-block hover:underline"
                            >
                                Forgot your password?
                            </Link>
                            <div className="relative">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <button 
                                        onClick={() => setShowRegisterOptions(!showRegisterOptions)}
                                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                                    >
                                        Register Here
                                    </button>
                                </p>
                                {showRegisterOptions && (
                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                                        <Link 
                                            to="/register?type=client" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                        >
                                            Register as Client
                                        </Link>
                                        <Link 
                                            to="/register?type=therapist" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                        >
                                            Register as Therapist
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login 