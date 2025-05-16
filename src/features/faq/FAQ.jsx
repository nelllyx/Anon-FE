import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What is Anonymous Therapy?",
      answer: "Anonymous Therapy is an online platform that connects individuals with licensed therapists for confidential mental health support. We provide a safe, secure, and accessible way to receive professional therapy from the comfort of your home."
    },
    {
      question: "How does online therapy work?",
      answer: "Online therapy works through secure video sessions, chat, or phone calls. You'll be matched with a licensed therapist based on your needs and preferences. Sessions are conducted through our secure platform, ensuring privacy and confidentiality."
    },
    {
      question: "Is online therapy as effective as in-person therapy?",
      answer: "Yes, numerous studies have shown that online therapy can be just as effective as traditional in-person therapy. Many clients find it more convenient and comfortable, leading to better engagement and outcomes."
    },
    {
      question: "How much does therapy cost?",
      answer: "Our therapy sessions are competitively priced and vary based on the therapist's experience and specialization. We offer different packages and payment plans to make therapy accessible. Contact us for specific pricing details."
    },
    {
      question: "Is my information kept confidential?",
      answer: "Absolutely. We take confidentiality very seriously. All sessions are encrypted, and your information is protected under strict privacy laws. Your therapist is bound by professional ethics and legal requirements to maintain confidentiality."
    },
    {
      question: "How do I choose the right therapist?",
      answer: "We'll help you find the right therapist based on your specific needs, preferences, and goals. You can browse therapist profiles, read reviews, and schedule a consultation to ensure a good fit before starting regular sessions."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our therapy services and how we can help you.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </h3>
                  <FaChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              <div
                className={`px-6 transition-all duration-200 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100 pb-4'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ; 