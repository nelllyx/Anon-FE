import { FaStar, } from 'react-icons/fa';
import styles from './TherapySection.module.css';
import femaleTherapist from "../../assets/pexels-emmy.jpg";
import maleTherapist from "../../assets/doctor.jpg";
import secondFemale from "../../assets/medical-assistant.jpg";

const TherapySection = () => {
  const therapists = [
    {
      image: femaleTherapist,
      name: "Sarah Johnson",
      title: "Marriage Counselor",
      specialization: "Relationship dynamics, communication, and conflict resolution",
      description: "Helping couples build stronger, healthier relationships through evidence-based therapy approaches.",
      rating: 4.9,
      experience: "10+ years"
    },
    {
      image: maleTherapist,
      name: "Dr. Michael Chen",
      title: "Clinical Psychologist",
      specialization: "Cognitive behavioral therapy and mental health assessment",
      description: "Providing evidence-based treatment for various psychological conditions with a compassionate approach.",
      rating: 4.8,
      experience: "15+ years"
    },
    {
      image: secondFemale,
      name: "Emily Rodriguez",
      title: "Mental Health Therapist",
      specialization: "Anxiety, depression, and stress management",
      description: "Offering personalized therapy approaches to support your mental wellness journey.",
      rating: 4.9,
      experience: "8+ years"
    }
  ];

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`${styles.sectionHeader} text-center mb-12 md:mb-16`}>
          <div className="inline-block mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full mx-auto"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
            Meet Our Therapists
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
            Our team of licensed professionals is here to support your mental health journey with expertise and care.
          </p>
        </div>

        {/* Therapists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {therapists.map((therapist, index) => (
            <div
              key={index}
              className={`${styles.therapistCard} group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-transparent`}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                <img
                  src={therapist.image}
                  alt={therapist.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-sm font-bold text-gray-900">{therapist.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {therapist.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm md:text-base mb-2">
                    {therapist.title}
                  </p>
                  {/* Experience Badge - Moved to inline position */}
                  <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md mb-3">
                    {therapist.experience}
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium mb-3">
                    {therapist.specialization}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                    {therapist.description}
                  </p>
                  
                  {/* Button */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2">
                    View Profile
                  </button>
                </div>
              </div>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-bl-full transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TherapySection;
