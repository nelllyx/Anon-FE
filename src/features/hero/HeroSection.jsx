import { FaArrowRight } from 'react-icons/fa';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <div className={`${styles.hero_bg} relative w-full min-h-[85vh] sm:min-h-[90vh] md:min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20 lg:pt-32 xl:pt-40`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-19">
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 md:space-y-4 lg:mt-8 xl:mt-12">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight">
            Your Journey to <br className="hidden sm:block" />
            <span className="text-blue-400">Better Mental Health</span> <br className="hidden sm:block" />
            Starts Here
          </h1>
          
          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed px-2 sm:px-4">
            Professional therapy, accessible from anywhere. Connect with licensed therapists 
            who understand your unique needs and are ready to support your mental wellness journey.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10 w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
              Book a Session
              <FaArrowRight className="text-sm" />
            </button>
            <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base">
              Learn More
            </button>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default HeroSection;