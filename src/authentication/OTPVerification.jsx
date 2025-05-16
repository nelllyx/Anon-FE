import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { email, userId, userRole } = location.state || {};

  useEffect(() => {
    if (!email || !userId || !userRole) {
      navigate('/login', { replace: true });
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, userId, userRole, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: userRole,
          id: userId,
          otp: otpValue,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Store authentication data
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('userRole', userRole);
        
        // Store user data
        const userData = {
          firstName: responseData.data.user.firstName,
          lastName: responseData.data.user.lastName,
          username: responseData.data.user.username,
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Navigate based on user role
        if (userRole === 'client') {
          navigate('/client/dashboard', { replace: true });
        } else if (userRole === 'therapist') {
          navigate('/therapist/dashboard', { replace: true });
        }
      } else {
        setError(responseData.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Verification error:', error);
    }
  };

  const handleResendOTP = async () => {
    try {
      const endpoint = userRole === 'client' 
        ? 'http://localhost:3000/api/v1/client/resend-otp'
        : 'http://localhost:3000/api/v1/therapist/resend-otp';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: userId,
          role: userRole
        }),
      });

      if (response.ok) {
        setTimer(60);
        setCanResend(false);
        setError('');
      } else {
        const responseData = await response.json();
        setError(responseData.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-9">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6">
        <div className="w-full flex flex-col items-center space-y-2 text-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-sans text-2xl md:text-3xl font-bold tracking-wide">
            Anonymous Therapy
          </span>
          <h1 className="text-2xl font-semibold text-gray-800 mt-2">Verify Your Email</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            We&#39;ve sent a 6-digit verification code to {email}
          </p>
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Verify Email
            </button>
          </div>
        </form>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            {timer > 0 ? (
              `Resend code in ${timer} seconds`
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={!canResend}
                className={`text-blue-600 hover:text-blue-700 font-medium transition-colors ${
                  !canResend ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Resend verification code
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;