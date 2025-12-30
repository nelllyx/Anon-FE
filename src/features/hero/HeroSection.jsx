import { FaArrowRight } from 'react-icons/fa';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <div className={`${styles.hero_bg} relative w-full min-h-[60vh] sm:min-h-[65vh] md:min-h-[70vh] lg:min-h-[75vh] flex items-start justify-center pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-8 sm:pb-10 md:pb-12 lg:pb-16`}>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20" />
      
      {/* Content */}
      <div className={`${styles.heroContent} relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 mt-8 sm:mt-10 md:mt-12`}>
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 md:space-y-6">
          {/* Decorative Accent */}
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full mb-2 opacity-80"></div>
          
          {/* Main Heading */}
          <h1 className={`${styles.heroTitle} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight`}>
            Your Journey to <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Better Mental Health
            </span> <br className="hidden sm:block" />
            Starts Here
          </h1>
          
          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-50 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4 font-light drop-shadow-lg">
            Professional therapy, accessible from anywhere. Connect with licensed therapists 
            who understand your unique needs and are ready to support your mental wellness journey.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10 w-full sm:w-auto justify-center">
            <button className={`${styles.primaryButton} group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-100`}>
              Book a Session
              <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base border-2 border-white/30 hover:border-white/50 hover:scale-105 active:scale-100 shadow-xl">
              Learn More
            </button>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default HeroSection;