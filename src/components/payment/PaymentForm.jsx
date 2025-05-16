import {useState} from 'react';
import {FaArrowRight} from 'react-icons/fa';

const PaymentForm = () => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');


  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Validation
    if (!email.trim()) {
      setError('Please enter a valid email.');
      return;
    }
    if (!amount.trim() || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    try {

      const token = localStorage.getItem('token')
      const responseDataString = sessionStorage.getItem('responseData')
      const responseData = JSON.parse(responseDataString);
      const bookingId = responseData.id;
      console.log(bookingId)
      const response = await fetch('http://localhost:3000/api/v1/client/payment/initialize', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
         email,
          amount,
          bookingId
        })

      })


      if(response.ok){

        const responseData = await response.json()



        console.log(responseData);


        setLoading(true);
        // Simulate payment process
        setTimeout(() => {
          setLoading(false);
          setSuccess('Payment initiated successfully!');
          setEmail('');
          setAmount('');
        }, 1500);

        window.location.href = responseData.data.authorization_url;

      }else {

        // Try to parse JSON error, fallback to text if not JSON
        let errorMsg = "Payment initialization failed. Please try again.";
        // Clone response for fallback parsing
        const responseClone = response.clone();
        try {
          const data = await response.json();
          errorMsg = "Payment initialization failed: " + (data.message || errorMsg);
        } catch {
          const text = await responseClone.text();
          if (text) errorMsg = "Payment initialization failed: " + text;
        }
        setError(errorMsg);

      }


    }catch (error){

      const errorMsg = "A network error occurred. Please try again later.";
      setError(errorMsg);
      console.error("Network error:", error);
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
        <h2 className="py-3 text-yellow-500 text-3xl font-extrabold text-center mb-2">Payment Details</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Fill in the details below to proceed with your payment.</p>
        {error && <div className="mb-4 text-red-600 text-center text-sm font-semibold">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-center text-sm font-semibold">{success}</div>}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-semibold mb-1">Email Address</label>
          <input
            id="category"
            name="category"
            type="text"
            className="mb-1 h-[50px] w-full pl-4 pr-3 text-white bg-[#223C60] border-2 border-transparent focus:text-white focus:bg-[#0C4160] focus:border-[#2d4dda] focus:shadow-none focus:outline-none rounded-lg placeholder:text-sm placeholder:font-semibold transition"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-required="true"
            aria-label="Category"
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