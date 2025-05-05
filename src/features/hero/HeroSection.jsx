import { FaArrowRight } from 'react-icons/fa';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <div className={`${styles.hero_bg} relative w-full min-h-[85vh] flex items-center justify-center`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Your Journey to <br className="hidden md:block" />
            <span className="text-blue-400">Better Mental Health</span> <br className="hidden md:block" />
            Starts Here
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Professional therapy, accessible from anywhere. Connect with licensed therapists 
            who understand your unique needs and are ready to support your mental wellness journey.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2">
              Book a Session
              <FaArrowRight className="text-sm" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300">
              Learn More
            </button>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default HeroSection;