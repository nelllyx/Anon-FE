import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUsers, FaHeart, FaShieldAlt, FaRegCalendarCheck } from 'react-icons/fa';
import { isAuthenticated, hasRole, getToken } from '../../utils/auth';

const PLAN_THERAPIES = {
  Basic: ['Nutritional Therapy', 'Adolescent Therapy'],
  Standard: ['Marriage & Family Therapy', 'Nutritional Therapy', 'Cognitive Therapy', 'Adolescent Therapy' ],
  Premium: ['Clinical Psychology', 'Marriage & Family Therapy', 'Nutritional Therapy', 'Cognitive Therapy', 'Career & Life Coaching'],
};

const AVAILABLE_DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

const TIME_PREFERENCES = [
  { id: 'morning', label: 'Morning', time: '8 AM - 12 PM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '1 PM - 5 PM', icon: '☀️' },
  { id: 'Evening', label: 'Evening', time: '5 PM - 9 PM', icon: '🌙' }
];

const SESSIONS_PER_PLAN = {
  Basic: 1,
  Standard: 2,
  Premium: 4
};

const TalkToTherapist = () => {
  const [therapyType, setTherapyType] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [timePreference, setTimePreference] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [userPlan, setUserPlan] = useState(null);
  const navigate = useNavigate();

  // Authentication check and fetch user's active plan
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/talk-to-therapist' } });
      return;
    }

    if (!hasRole('client')) {
      navigate('/unauthorized');
      return;
    }
    // Fetch user's active subscription plan
    fetchUserPlan();
  }, [navigate]);

  const fetchUserPlan = async () => {
    // Check if we're already fetching
    if (sessionStorage.getItem('fetchingUserPlan')) {
      return;
    }
    
    sessionStorage.setItem('fetchingUserPlan', 'true');
    
    try {
      const token = getToken();

      const response = await fetch('http://localhost:3000/api/v1/client/subscription/plan', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserPlan(data.data.planName);
      } else {
        navigate('/subscribe', { 
          state: { message: 'Please subscribe to a plan before booking sessions.' }
        });
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
      navigate('/subscribe');
    } finally {
      sessionStorage.removeItem('fetchingUserPlan');
    }
  };

  // Update therapyType if not available in user's plan
  useEffect(() => {
    if (userPlan && PLAN_THERAPIES[userPlan]) {
      const availableTherapies = PLAN_THERAPIES[userPlan];
      if (!availableTherapies.includes(therapyType)) {
        setTherapyType('');
      }
    }
  }, [userPlan, therapyType]);

  // Reset selected days when plan changes
  useEffect(() => {
    setSelectedDays([]);
  }, [userPlan]);

  const handleDaySelection = (day) => {
    if (!userPlan) return;
    
    const maxSessions = SESSIONS_PER_PLAN[userPlan];
    
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else if (selectedDays.length < maxSessions) {
      setSelectedDays([...selectedDays, day]);
    } else {
      setError(`You can only select ${maxSessions} day${maxSessions > 1 ? 's' : ''} for the ${userPlan} plan.`);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingMsg('');
    setError('');
    
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/talk-to-therapist' } });
      return;
    }

    if (!userPlan) {
      setError('Please subscribe to a plan before booking sessions.');
      navigate('/subscribe');
      return;
    }

    if (!therapyType) {
      setError('Please select a type of therapy.');
      return;
    }

    const maxSessions = SESSIONS_PER_PLAN[userPlan];
    if (selectedDays.length !== maxSessions) {
      setError(`Please select exactly ${maxSessions} day${maxSessions > 1 ? 's' : ''} for your sessions.`);
      return;
    }

    if (!timePreference) {
      setError('Please select your preferred time of day.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        navigate('/login', { state: { from: '/talk-to-therapist' } });
        return;
      }

      const response = await fetch('http://localhost:3000/api/v1/client/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName: userPlan,
          therapyType: therapyType,
          sessionDays: selectedDays,
          preferredTime: timePreference
        }),
      });

      if (response.ok) {
        let timePreferenceLabel = TIME_PREFERENCES.find(t => t.id === timePreference)?.label;
        setBookingMsg(
          `Booking successful! You selected ${therapyType} on ${selectedDays.join(', ')} during ${timePreferenceLabel}. A therapist will contact you to schedule the exact time for your sessions within your preferred time window.`
        );
        setShowModal(true);
      } else {
        let errorMsg = "Failed to make Bookings.";
        const responseClone = response.clone();
        try {
          const data = await response.json();
          errorMsg = "Failed to make Bookings: " + (data.message || errorMsg);
        } catch {
          const text = await responseClone.text();
          if (text) errorMsg = "Failed to make Bookings: " + text;
        }
        setError(errorMsg);
      }
    } catch (error) {
      const errorMsg = "A network error occurred. Please try again later.";
      setError(errorMsg);
      console.error("Network error:", error);
    }
  };

  const handleProceedToDashboard = () => {
    setShowModal(false);
    navigate('/client/dashboard', { replace: true });
  };

  if (!userPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaUsers className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Active Subscription</h2>
          <p className="text-gray-600 mb-8">Please subscribe to a plan before booking therapy sessions.</p>
          <button
            onClick={() => navigate('/subscribe')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Subscribe to a Plan
          </button>
        </div>
      </div>
    );
  }

  const availableTherapies = PLAN_THERAPIES[userPlan] || [];
  const maxSessions = SESSIONS_PER_PLAN[userPlan] || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FaRegCalendarCheck className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Book Your Session</h1>
                  <p className="text-indigo-100 mt-1">Schedule your therapy appointment with our expert therapists</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl">
                  <FaUsers className="text-indigo-200" />
                  <span className="text-sm font-medium">Licensed Therapists</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-2xl">
                  <FaShieldAlt className="text-indigo-200" />
                  <span className="text-sm font-medium">100% Confidential</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                  <div className="text-sm text-indigo-100">Your Plan</div>
                  <div className="text-xl font-bold">{userPlan}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl">
                  <div className="text-sm text-indigo-100">Sessions</div>
                  <div className="text-xl font-bold">{maxSessions}/week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Therapy Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Therapy Type Selection */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <FaUsers className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Therapy Type</h2>
                  <p className="text-gray-600">Choose the type of therapy that best fits your needs</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableTherapies.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTherapyType(type)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                      therapyType === type 
                        ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg' 
                        : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        therapyType === type ? 'bg-indigo-500' : 'bg-gray-100'
                      }`}>
                        <FaHeart className={`text-sm ${therapyType === type ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <span className={`font-semibold ${therapyType === type ? 'text-indigo-700' : 'text-gray-700'}`}>
                        {type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Day Selection */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <FaCalendarAlt className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Days</h2>
                  <p className="text-gray-600">Choose {maxSessions} day{maxSessions > 1 ? 's' : ''} for your sessions</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AVAILABLE_DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDaySelection(day)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                      selectedDays.includes(day)
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-semibold'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Preference */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <FaClock className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Preferred Time</h2>
                  <p className="text-gray-600">Select your preferred time of day</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TIME_PREFERENCES.map(pref => (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setTimePreference(pref.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 text-center ${
                      timePreference === pref.id
                        ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{pref.icon}</div>
                    <div className={`font-semibold ${timePreference === pref.id ? 'text-orange-700' : 'text-gray-700'}`}>
                      {pref.label}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{pref.time}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Booking */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold text-gray-900">{userPlan}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Therapy</span>
                  <span className="font-semibold text-gray-900">{therapyType || 'Not selected'}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Days</span>
                  <span className="font-semibold text-gray-900">
                    {selectedDays.length > 0 ? selectedDays.join(', ') : 'Not selected'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold text-gray-900">
                    {timePreference ? TIME_PREFERENCES.find(t => t.id === timePreference)?.label : 'Not selected'}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!therapyType || selectedDays.length !== maxSessions || !timePreference}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                <FaRegCalendarCheck />
                Book Session
              </button>
            </div>
          </div>
        </div>

        {/* What happens next section - moved outside the grid to avoid blocking */}
        <div className="mt-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 border border-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">What happens next?</h3>
                <p className="text-gray-600">Here&#39;s what to expect after booking your session</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Therapist Contact</h4>
                  <p className="text-sm text-gray-600">Your therapist will contact you within 24 hours to confirm your booking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Schedule Confirmation</h4>
                  <p className="text-sm text-gray-600">They&#39;ll schedule exact times within your preferred time window</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Secure Sessions</h4>
                  <p className="text-sm text-gray-600">All sessions are confidential and conducted in a secure environment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">{bookingMsg}</p>
            <button
              onClick={handleProceedToDashboard}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalkToTherapist; 