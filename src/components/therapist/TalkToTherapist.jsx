import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown, FaStar, FaGem, FaCheckCircle } from 'react-icons/fa';

const PLAN_THERAPIES = {
  Basic: ['Nutritional Therapy', 'Adolescent Therapy'],
  Standard: ['Marriage & Family Therapy', 'Nutritional Therapy', 'Cognitive Therapy'],
  Premium: ['Clinical Psychology', 'Marriage & Family Therapy', 'Nutritional Therapy', 'Cognitive Therapy'],
};

const PLANS = [
  { name: 'Basic', price: 0, desc: 'Free, limited access', icon: <FaStar className="text-blue-400 text-2xl" /> },
  { name: 'Standard', price: 50000, desc: 'Twice a week, Wednesdays and Fridays', icon: <FaCrown className="text-yellow-500 text-2xl" /> },
  { name: 'Premium', price: 100000, desc: 'Unlimited sessions, priority support', icon: <FaGem className="text-purple-500 text-2xl" /> },
];

const TalkToTherapist = () => {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0].name);
  const [therapyType, setTherapyType] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Update therapyType if not available in new plan
  useEffect(() => {
    const availableTherapies = PLAN_THERAPIES[selectedPlan];
    if (!availableTherapies.includes(therapyType)) {
      setTherapyType('');
    }
  }, [selectedPlan]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingMsg('');
    setError('');
    if (!therapyType) {
      setError('Please select a type of therapy.');
      return;
    }

    try{

    const  token = localStorage.getItem('token')

      const response = await fetch('http://localhost:3000/api/v1/client/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planName: selectedPlan,
          selectedTherapy: therapyType
        })
      })

      if(response.ok){

        const responseData = await response.json()

        sessionStorage.setItem('responseData', JSON.stringify({price: responseData.data.price, id: responseData.data.id}))

        console.log(responseData);

        navigate('/payment', { replace: true });

      }else {

        // Try to parse JSON error, fallback to text if not JSON
        let errorMsg = "Failed to make Bookings.";
        // Clone response for fallback parsing
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


    }catch (error){

      const errorMsg = "A network error occurred. Please try again later.";
      setError(errorMsg);
      console.error("Network error:", error);
    }



    setBookingMsg(
      `Booking successful! You selected the ${selectedPlan} plan for ${therapyType}. Our team will contact you soon.`
    );
    setShowModal(true);
  };

  const handleProceedToPayment = () => {
    setShowModal(false);

   // navigate('/payment', { state: { plan: selectedPlan, therapyType } });
  };

  const availableTherapies = PLAN_THERAPIES[selectedPlan];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center py-8 px-2 font-montserrat">
      {/* Simplified Full-width Hero Banner */}
      <div className="w-full h-[340px] md:h-[420px] mb-10 relative">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
          alt="Therapy Session"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-black/60 via-black/40 to-black/20">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl px-8 py-8 md:px-16 md:py-12 shadow-xl max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-blue-900 mb-3 drop-shadow-sm">
              Start Your Therapy Journey
            </h2>
            <p className="text-lg md:text-2xl text-blue-800 mb-6">
              Book a session with a licensed therapist. Choose your plan and therapy type to get started.
            </p>
            <a href="#booking" className="inline-block bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200">
              Start Now
            </a>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="w-full max-w-4xl mx-auto mb-10">
        <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Choose Your Plan</h3>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {PLANS.map(plan => (
            <button
              type="button"
              key={plan.name}
              className={`flex-1 flex flex-col items-center p-6 rounded-2xl border-2 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 backdrop-blur-md ${selectedPlan === plan.name ? 'border-blue-500 scale-105 ring-2 ring-blue-200' : 'border-blue-100 hover:scale-105 hover:border-blue-300'}`}
              onClick={() => setSelectedPlan(plan.name)}
              aria-pressed={selectedPlan === plan.name}
            >
              <div className="mb-2">{plan.icon}</div>
              <div className="text-xl font-bold mb-1 text-blue-900">{plan.name}</div>
              <div className="text-sm text-blue-700 mb-2">{plan.desc}</div>
              <div className="text-lg font-extrabold text-blue-700">{plan.price === 0 ? 'Free' : `₦${plan.price.toLocaleString()}`}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Therapy Type Selection as Pills */}
      <div className="w-full max-w-3xl mx-auto mb-10">
        <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">Select Therapy Type</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {availableTherapies.map(type => (
            <button
              key={type}
              type="button"
              className={`px-5 py-2 rounded-full border-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${therapyType === type ? 'bg-blue-500 text-white border-blue-500 shadow' : 'bg-white/80 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
              onClick={() => setTherapyType(type)}
              aria-pressed={therapyType === type}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Card */}
      <div id="booking" className="w-full max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-100 p-8">
        <h3 className="text-xl font-bold text-blue-900 mb-6 text-center">Book a Session</h3>
        {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
        <form onSubmit={handleBooking} className="space-y-6">
          <div className="flex flex-col gap-2">
            <span className="text-blue-700 font-semibold">Selected Plan:</span>
            <span className="text-lg font-bold text-blue-900">{selectedPlan}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-blue-700 font-semibold">Therapy Type:</span>
            <span className="text-lg font-bold text-blue-900">{therapyType || 'None selected'}</span>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 text-lg mt-2"
          >
            Book Now
          </button>
        </form>
      </div>

      {/* Booking Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative animate-fade-in">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2 text-blue-900">Booking Confirmed!</h4>
            <p className="text-blue-700 mb-4">{bookingMsg}</p>
            <button
              onClick={handleProceedToPayment}
              className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-full font-semibold shadow hover:bg-blue-600 transition"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalkToTherapist; 