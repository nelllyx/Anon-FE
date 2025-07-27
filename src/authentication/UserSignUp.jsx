import {Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [isValid, setValid] = useState(false);
  const [user, setUser] = useState({
    username: '',
    password: '',
    confirmPass: '',
    email: '',
    gender: ''
  });
  const [error, setError] = useState("");

  const validate = () => {
    setValid(
      user.username.trim().length > 2 &&
      user.password.trim().length > 7 &&
      user.confirmPass.trim().length > 7 &&
      user.password === user.confirmPass &&
      user.email.endsWith('mail.com') &&
      (user.gender === 'male' || user.gender === 'female')
    );
  };

  useEffect(() => {
    validate();
  }, [user.username, user.password, user.confirmPass, user.email, user.gender]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setError("Please fill all fields correctly.");
      return;
    }
    setError("");
    try {
      const response = await fetch('http://localhost:3000/api/v1/client/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('userData', JSON.stringify({username: data.data.user.username}))

        navigate("/verify-otp", { 
          replace: true,
          state: { 
            email: user.email,
            userId: data.data.user._id,
            userRole: data.data.user.role
          }
        });

      } else {
        // Try to parse JSON error, fallback to text if not JSON
        let errorMsg = "Registration failed.";
        // Clone response for fallback parsing 
        const responseClone = response.clone();
        try {
          const data = await response.json();
          errorMsg = "Registration failed: " + (data.message || errorMsg);
        } catch {
          const text = await responseClone.text();
          if (text) errorMsg = "Registration failed: " + text;
        }
        setError(errorMsg);
      }
    } catch (error) {
      const errorMsg = "A network error occurred. Please try again later.";
      setError(errorMsg);
      console.error("Network error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-9">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6 mt-12">
        <div className="w-full flex flex-col items-center space-y-2 text-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-sans text-2xl md:text-3xl font-bold tracking-wide">
            Anonymous Therapy
          </span>
          <h1 className="text-2xl font-semibold text-gray-800 mt-2">Create a free account</h1>
          <p className="text-gray-600 text-sm leading-relaxed">Please provide your valid credentials to get started.</p>
          <p className="text-blue-500 text-xs mt-1">Your privacy is our priority. All information is confidential.</p>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={user.username}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your username"
              required
              onChange={e => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={user.email}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your email"
              required
              onChange={e => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={user.password}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your password"
              required
              onChange={e => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPass"
              type="password"
              name="confirmPass"
              value={user.confirmPass}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Confirm your password"
              required
              onChange={e => setUser({ ...user, confirmPass: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-6 pt-2">
            <label className="text-sm font-medium text-gray-700">Gender:</label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={user.gender === 'male'}
                onChange={() => setUser({ ...user, gender: 'male' })}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={user.gender === 'female'}
                onChange={() => setUser({ ...user, gender: 'female' })}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Female</span>
            </label>
          </div>
          <div className="flex items-center justify-center pt-4">
            <button
              type="submit"
              disabled={!isValid}
              className={`text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-10 space-y-4 text-center">
          <p className="text-sm text-gray-600">
            Are you a therapist?{' '}
            <Link
              to="/register/therapist"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
              Register as Therapist
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 