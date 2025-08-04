import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaStar, FaGem, FaCheckCircle, FaClock, FaCalendarAlt, FaUsers, FaHeart, FaShieldAlt } from 'react-icons/fa';
import { isAuthenticated, hasRole, getToken } from '../../utils/auth';

const PLANS = [
  { 
    name: 'Basic', 
    price: 0, 
    desc: 'Perfect for getting started with therapy',
    icon: <FaStar className="text-blue-400 text-xl" />,
    features: [
      { text: 'Session length: 45 minutes', icon: <FaClock className="text-blue-500" /> },
      { text: 'One session per week', icon: <FaCalendarAlt className="text-blue-500" /> },
      { text: 'Access to a selection of therapy types', icon: <FaUsers className="text-blue-500" /> }
    ]
  },
  { 
    name: 'Standard', 
    price: 50000, 
    desc: 'Most popular choice for consistent support',
    icon: <FaCrown className="text-yellow-500 text-xl" />,
    features: [
      { text: 'Session length: 45 minutes', icon: <FaClock className="text-yellow-500" /> },
      { text: 'Two sessions per week', icon: <FaCalendarAlt className="text-yellow-500" /> },
      { text: 'Access to a selection of therapy types', icon: <FaUsers className="text-yellow-500" /> }
    ]
  },
  { 
    name: 'Premium', 
    price: 100000, 
    desc: 'Comprehensive therapy support for intensive care',
    icon: <FaGem className="text-purple-500 text-xl" />,
    features: [
      { text: 'Session length: 60 minutes', icon: <FaClock className="text-purple-500" /> },
      { text: 'Four sessions per week', icon: <FaCalendarAlt className="text-purple-500" /> },
      { text: 'Access to all therapy types', icon: <FaUsers className="text-purple-500" /> }
    ]
  },
];

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0].name);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Authentication and role checks
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/subscribe' } });
      return;
    }
    if (!hasRole('client')) {
      navigate('/unauthorized');
    }
  }, [navigate]);

  const handleSubscribe = async () => {
    const planDetails = PLANS.find(p => p.name === selectedPlan);
    if (!planDetails) {
      setError('Please select a valid plan.');
      return;
    }

    if (planDetails.price === 0) {
      await activateFreePlan(planDetails);
      return;
    }

    // For paid plans, try to create a pending subscription first
    try {
      const token = getToken();
      const response = await fetch('http://localhost:3000/api/v1/client/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName: planDetails.name,
          status: 'pending'
        })
      });
      const result = await response.json();
      if (response.ok && result && result.data && result.data.id) {
        // Success: store plan info + id and redirect to payment
        sessionStorage.setItem('subscriptionData', JSON.stringify({
          planName: planDetails.name,
          price: planDetails.price,
          id: result.data.id,
          type: 'subscription'
        }));
        navigate('/payment');
      } else {
        // Show backend error message on subscription page
        let errorText = 'Failed to create subscription.';
        if (result && result.message) {
          errorText = 'Failed to activate subscription. ' + result.message;
        }
        setError(errorText);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const activateFreePlan = async (planDetails) => {
    const token = getToken();
    try {
      const response = await fetch('http://localhost:3000/api/v1/client/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName: planDetails.name
        })
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        // Try to parse a user-friendly error message
        let errorText = 'Failed to activate subscription.';
        const responseClone = response.clone();
        try {
          const data = await response.json();
          errorText = 'Failed to activate subscription.' + (data.message || errorText);
        } catch {
          const text = await responseClone.text();
          if (text) errorText = "Failed to make Bookings: " + text;
        }
        setError(errorText);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/client/dashboard', { 
      state: { message: `Successfully subscribed to Basic plan!` }
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center py-8 px-4 font-montserrat">
      {/* Hero Section with Image */}
      <div className="w-full max-w-6xl mx-auto text-center mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
          <div className="flex-1 text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-4">
              Start Your Healing Journey Today
            </h1>
            <p className="text-lg text-blue-800 mb-6">
              Choose the perfect therapy plan that fits your needs and schedule. 
              Our licensed therapists are here to support your mental wellness.
            </p>
            <div className="flex items-center gap-4 text-blue-700 mb-4">
              <FaHeart className="text-xl text-red-500" />
              <span className="font-semibold">Professional Care</span>
              <span className="text-blue-500">•</span>
              <FaShieldAlt className="text-xl text-green-500" />
              <span className="font-semibold">100% Confidential</span>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
              <div className="text-white text-center">
                <FaUsers className="text-6xl mx-auto mb-4" />
                <p className="text-xl font-bold">Expert Therapists</p>
                <p className="text-sm opacity-90">Ready to Help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Our Therapy Plans Section - Now First */}
      <div className="w-full max-w-5xl mx-auto mb-12">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Why Choose Our Therapy Plans?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-blue-50/50">
              <FaUsers className="text-4xl text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Expert Therapists</h3>
              <p className="text-gray-600 text-sm">Licensed professionals with years of experience in various therapy approaches.</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-blue-50/50">
              <FaClock className="text-4xl text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 text-sm">Book sessions that fit your schedule with morning, afternoon, or evening options.</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-blue-50/50">
              <FaCheckCircle className="text-4xl text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your privacy is our priority with secure, confidential sessions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section - More Compact */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">Choose Your Plan</h2>
        
        {error && (
          <div className="mb-8 text-center">
            <p className="text-red-600 font-semibold text-lg">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          {PLANS.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-6 rounded-2xl border-2 shadow-lg transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-md ${
                selectedPlan === plan.name 
                  ? 'border-blue-500 scale-105 ring-2 ring-blue-200 shadow-xl' 
                  : 'border-gray-200 hover:border-blue-300 hover:scale-105'
              } ${index === 1 ? 'md:scale-105 md:-mt-2' : ''}`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {/* Popular Badge for Standard Plan */}
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {plan.price === 0 ? 'Free' : `₦${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && <span className="text-gray-500 ml-1 text-sm">/month</span>}
                </div>
              </div>

              {/* Features List - More Compact */}
              <div className="flex-1 mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">What's Included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.icon}
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subscribe Button */}
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={selectedPlan !== plan.name}
                className={`w-full py-3 px-4 rounded-xl font-bold text-base transition-all duration-200 ${
                  selectedPlan === plan.name
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedPlan === plan.name ? 'Subscribe Now' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal for Basic Plan */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative animate-fade-in">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2 text-blue-900">Subscription Confirmed!</h4>
            <p className="text-blue-700 mb-4">You have successfully subscribed to the Basic plan.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSuccessClose}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-full font-semibold shadow hover:bg-blue-600 transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/talk-to-therapist')}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition"
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans; 