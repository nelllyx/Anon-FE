import {FaShieldAlt, FaClock, FaUsers, FaUserMd} from 'react-icons/fa';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  const features = [
    {
      title: "Mental Health is No Joke",
      description: "Mental health is not a luxury—it's a necessity. In a world that often misunderstands emotional struggles, we're here to provide a sanctuary of support, understanding, and professional care.",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50"
    },
    {
      title: "Seek Help from Professionals",
      description: "Need someone to talk to? Our licensed therapists are available to give you the support you need. You can get confidential online consultations and tailored mental health guidance when you sign up at a subsidized amount.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      title: "Grow at Your Own Pace",
      description: "We recognize that mental health recovery isn't linear. Whether you need a listening ear or comprehensive therapeutic support, we meet you exactly where you are. Take the first step. Choose your path. Start healing.",
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50"
    }
  ];

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`${styles.sectionHeader} text-center mb-12 md:mb-16`}>
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full mx-auto"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            We&#39;re committed to making mental health support accessible, professional, and personalized for everyone.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${styles.featureCard} group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-5 overflow-hidden border border-gray-100 hover:border-transparent`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm md:text-base group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Corner Accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Additional Stats Section */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: <FaUsers />, number: "500+", label: "Happy Clients" },
            { icon: <FaUserMd />, number: "50+", label: "Expert Therapists" },
            { icon: <FaClock />, number: "24/7", label: "Available Support" },
            { icon: <FaShieldAlt />, number: "100%", label: "Confidential" }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-3 md:p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="text-blue-600 text-xl md:text-2xl mb-1 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="text-xs md:text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;