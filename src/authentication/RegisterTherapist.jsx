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
    yearsOfExperience: '',
    phoneNumber: '',
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
      therapist.specialization.trim().length > 2 &&
      therapist.yearsOfExperience.trim().length > 0 &&
      therapist.phoneNumber.trim().length > 9
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
        const data = await response.json();
        localStorage.setItem('userData', JSON.stringify({
          firstName: data.data.therapist.firstName,
          lastName: data.data.therapist.lastName
        }));
        console.log('Registration Response:', data);
        navigate("/verify-otp", {
          replace: true,
          state: {
            email: therapist.email,
            userId: data.data.therapist._id,
            userRole: data.data.therapist.role
          }
        });
      } else {
        let errorMsg = "Registration failed.";
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
      const errorMsg = "A Network Error occurred. Please try again";
      setError(errorMsg);
      console.error("Network Error: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Therapist Registration</h1>
            <p className="text-blue-100">Join our platform as a licensed therapist</p>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
        </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              id="firstName"
              type="text"
              value={therapist.firstName}
                      className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your first name"
              required
              onChange={e => setTherapist({ ...therapist, firstName: e.target.value })}
            />
          </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={therapist.lastName}
                      className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your last name"
              required
              onChange={e => setTherapist({ ...therapist, lastName: e.target.value })}
            />
          </div>
          </div>

                <div className="flex items-center gap-6">
            <label className="text-sm font-medium text-gray-700">Gender:</label>
                  <div className="flex gap-4">
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
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={therapist.email}
                      className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                      onChange={e => setTherapist({ ...therapist, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={therapist.phoneNumber}
                      className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                      required
                      onChange={e => setTherapist({ ...therapist, phoneNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
            <input
              id="license"
              type="text"
              value={therapist.licenseNo}
                      className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your license number"
              required
              onChange={e => setTherapist({ ...therapist, licenseNo: e.target.value })}
            />
          </div>
                  <div>
                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      max="50"
                      value={therapist.yearsOfExperience}
                      className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter years of experience"
                      required
                      onChange={e => setTherapist({ ...therapist, yearsOfExperience: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <select
                id="specialization"
                value={therapist.specialization}
                    className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                onChange={e => setTherapist({...therapist, specialization: e.target.value})}
            >
              <option value="">Select specialization</option>
              <option value="Adolescent therapy">Adolescent therapy</option>
              <option value="Clinical psychology">Clinical psychology</option>
              <option value="Marriage and family therapy">Marriage and family therapy</option>
              <option value="Cbt">Cognitive therapy</option>
              <option value="Nutritional therapy">Nutritional therapy</option>
            </select>
          </div>
              </div>

              {/* Security Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Security</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={therapist.password}
                      className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                      required
                      onChange={e => setTherapist({ ...therapist, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPass" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      id="confirmPass"
                      type="password"
                      value={therapist.confirmPass}
                      className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm your password"
                      required
                      onChange={e => setTherapist({ ...therapist, confirmPass: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
            <button
              type="submit"
              disabled={!isValid}
                  className={`w-full py-3 text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Register
            </button>
          </div>
        </form>

            <div className="mt-8 space-y-4 text-center">
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
      </div>
    </div>
  );
};

export default RegisterTherapist; 