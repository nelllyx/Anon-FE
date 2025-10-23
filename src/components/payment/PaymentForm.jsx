import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaArrowRight, FaCheckCircle, FaTimesCircle, FaSpinner} from 'react-icons/fa';
import PaystackPop from '@paystack/inline-js'
import {  getUserData, getToken } from '../../utils/auth';

const PaymentForm = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const navigate = useNavigate();

  // On mount, check for subscriptionData and create pending subscription if needed
  useEffect(() => {
    const createPendingSubscription = async (data) => {
      sessionStorage.setItem('creatingSubscription', 'true');
      try {
        const response = await fetch('http://localhost:3000/api/v1/client/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
          mode: 'cors',

          body: JSON.stringify({
            planName: data.planName,
            status: 'pending'
          })
        });
        const result = await response.json();
        if (result && result.data && result.data.id) {
          data.id = result.data.id;
          sessionStorage.setItem('subscriptionData', JSON.stringify(data));
        } else {
          let errorText = 'Failed to create subscription.';
          if (result && result.message) {
            errorText = 'Failed to activate subscription.' + result.message;
          }
          setError(errorText);
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        sessionStorage.removeItem('creatingSubscription');
      }
    };

    const userData = getUserData();
    if (!userData || userData.role !== 'client') {
      navigate('/unauthorized');
      return;
    }

    let data = sessionStorage.getItem('subscriptionData');
    if (data) {
      data = JSON.parse(data);
      setAmount(data.price.toString());
      // Only create pending subscription if no id and not already creating
      if (!data.id && !sessionStorage.getItem('creatingSubscription')) {
        createPendingSubscription(data);
      }
    } else {
      navigate('/client/dashboard');
    }
  }, [navigate]);

  const checkTransactionStatus = async (reference) => {

    setLoading(true);
    try {
      const endpoint = `http://localhost:3000/api/v1/client/payment/verify/${reference}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setTransactionStatus({
          success: true,
          message: 'Subscription payment successful!',
          data: data.data
        });
        sessionStorage.removeItem('subscriptionData');
        navigate('/client/dashboard');
      } else {
        setTransactionStatus({
          success: false,
          message: data.message || 'Payment verification failed'
        });
      }
    } catch (error) {
      setTransactionStatus({
        success: false,
        message: 'Error verifying payment status'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter a valid email.');
      return;
    }
    if (!amount.trim() || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setLoading(true);

    try {
      const data = JSON.parse(sessionStorage.getItem('subscriptionData'));
      if (!data || !data.id) {
        setError('Subscription not initialized. Please try again.');
        setLoading(false);
        return;
      }
      const endpoint = 'http://localhost:3000/api/v1/client/payment/initialize';
      const requestBody = {
        email,
        amount,
        subscriptionId: data.id
      };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      const paymentResponse = await response.json();
      if (response.ok) {
        const popup = new PaystackPop();
        popup.resumeTransaction(paymentResponse.data.access_code, {
          onSuccess: (transaction) => {
            checkTransactionStatus(transaction.reference);
          },
          onCancel: () => {
            setTransactionStatus({
              success: false,
              message: 'Payment was cancelled'
            });
          }
        });
      } else {
        setError(paymentResponse.message || 'Payment initialization failed. Please try again.');
      }
    } catch (error) {
      setError('A network error occurred. Please try again later.');
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0C4160] p-4 sm:p-6 md:p-8 font-montserrat">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg mx-auto text-black rounded-2xl bg-white px-6 py-8 shadow-lg"
        autoComplete="off"
        aria-label="Payment form"
      >
        <h2 className="py-3 text-yellow-500 text-3xl font-extrabold text-center mb-2">
          Subscription Payment
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Complete your subscription payment to unlock therapy sessions.
        </p>
        
        {transactionStatus && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            transactionStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {loading ? (
              <FaSpinner className="animate-spin text-blue-500" />
            ) : transactionStatus.success ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
            <span className={transactionStatus.success ? 'text-green-600 font-medium' : 'text-red-600'}>
              {transactionStatus.message}
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold mb-1">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            className="mb-1 h-[50px] w-full pl-4 pr-3 text-white bg-[#223C60] border-2 border-transparent focus:text-white focus:bg-[#0C4160] focus:border-[#2d4dda] focus:shadow-none focus:outline-none rounded-lg placeholder:text-sm placeholder:font-semibold transition"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-required="true"
            aria-label="Email Address"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-semibold mb-1">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            className="mb-1 h-[50px] w-full pl-4 pr-3 text-white bg-[#223C60] border-2 border-transparent focus:text-white focus:bg-[#0C4160] focus:border-[#2d4dda] focus:shadow-none focus:outline-none rounded-lg placeholder:text-sm placeholder:font-semibold transition"
            placeholder="Enter amount (₦)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            aria-required="true"
            aria-label="Amount"
          />
        </div>

        <button
          type="submit"
          className={`mb-3 w-full h-[60px] flex items-center justify-center gap-3 bg-gradient-to-r from-[#77A1D3] via-[#79CBCA] to-[#77A1D3] border-none transition-all duration-500 bg-[size:200%_auto] hover:bg-right-center hover:text-white focus:outline-none rounded-lg text-lg font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transform transition-transform duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-xl`}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>Pay with Paystack</span>
              <FaArrowRight className="ml-2 text-xl group-hover:translate-x-2 transition-transform duration-200" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 