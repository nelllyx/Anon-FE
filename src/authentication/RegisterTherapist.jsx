import {Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";

const RegisterTherapist = () => {
  const navigate = useNavigate();
  const [isValid, setValid] = useState(false);
  const [therapist, setTherapist] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPass: '',
    gender: '',
    specialization: '',
    licenseNo: '',
  });
  const [error, setError] = useState("");

  const validate = () => {
    setValid(
      therapist.firstName.trim().length > 1 &&
      therapist.lastName.trim().length > 1 &&
      therapist.password.trim().length > 7 &&
      therapist.confirmPass.trim().length > 7 &&
      therapist.password === therapist.confirmPass &&
      therapist.email.endsWith('mail.com') &&
      therapist.licenseNo.trim().length > 3 &&
      therapist.specialization.trim().length > 2
    );
  };

  useEffect(() => {
    validate();
  }, [therapist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setError("Please fill all fields correctly.");
      return;
    }
    setError("");
    // Proceed with registration logic

    try {

      const response = await fetch('http://localhost:3000/api/v1/therapist/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(therapist),
      });

      if(response.ok){

        const data = await  response.json();

        localStorage.setItem('userData', JSON.stringify({
          firstName: data.data.therapist.firstName,
          lastName: data.data.therapist.lastName
        }))
        console.log('Registration Response:', data);

        navigate("/verify-otp", {
          replace: true,
          state: {
            email: therapist.email,
            userId: data.data.therapist._id,
            userRole: data.data.therapist.role
          }
      })

      }else {

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

  }catch (error) {
      const errorMsg = "A Network Error occurred. Please try again"
      setError(errorMsg)
      console.error("Network Error: " ,error)

    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-9">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6 mt-12">
        <div className="w-full flex flex-col items-center space-y-2 text-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-sans text-2xl md:text-3xl font-bold tracking-wide">
            Anonymous Therapy
          </span>
          <h1 className="text-2xl font-semibold text-gray-800 mt-2">Therapist Registration</h1>
          <p className="text-gray-600 text-sm leading-relaxed">Join our platform as a licensed therapist. Please provide your details below.</p>
          <p className="text-blue-500 text-xs mt-1">Your privacy is our priority. All information is confidential.</p>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={therapist.firstName}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your first name"
              required
              onChange={e => setTherapist({ ...therapist, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={therapist.lastName}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your last name"
              required
              onChange={e => setTherapist({ ...therapist, lastName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={therapist.email}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your email"
              required
              onChange={e => setTherapist({ ...therapist, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={therapist.password}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your password"
              required
              onChange={e => setTherapist({ ...therapist, password: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPass"
              type="password"
              name="confirmPass"
              value={therapist.confirmPass}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Confirm your password"
              required
              onChange={e => setTherapist({ ...therapist, confirmPass: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-6 pt-2">
            <label className="text-sm font-medium text-gray-700">Gender:</label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={therapist.gender === 'male'}
                onChange={() => setTherapist({ ...therapist, gender: 'male' })}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={therapist.gender === 'female'}
                onChange={() => setTherapist({ ...therapist, gender: 'female' })}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-gray-700">Female</span>
            </label>
          </div>
          <div className="space-y-2">
            <label htmlFor="license" className="block text-sm font-medium text-gray-700">License Number</label>
            <input
              id="license"
              type="text"
              name="license"
              value={therapist.licenseNo}
              className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your license number"
              required
              onChange={e => setTherapist({ ...therapist, licenseNo: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
            <select
                id="specialization"
                name="specialization"
                value={therapist.specialization}
                className="w-full h-12 pl-4 pr-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                onChange={e => setTherapist({...therapist, specialization: e.target.value})}
            >
              <option value="">Select specialization</option>
              <option value="Adolescent therapy">Adolescent therapy</option>
              <option value="Clinical psychology">Clinical psychology</option>
              <option value="Marriage and family therapy">Marriage and family therapy</option>
              <option value="Cbt">Cognitive behavior therapy</option>
              <option value="Nutritional therapy">Nutritional therapy</option>
            </select>
          </div>
          <div className="flex items-center justify-center pt-4">
            <button
              type="submit"
              disabled={!isValid}
              className={`text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Register
            </button>
          </div>
        </form>
        <div className="mt-10 space-y-4 text-center">
          <p className="text-sm text-gray-600">
            Want to register as a client?{' '}
            <Link
              to="/register/client"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
            >
              Register as Client
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

export default RegisterTherapist; 