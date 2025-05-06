import femaleTherapist from "../../assets/pexels-emmy.jpg";
import maleTherapist from "../../assets/male.jpg";
import secondFemale from "../../assets/female2.jpg";

const TherapySection = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Therapists
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our team of licensed professionals is here to support your mental health journey with expertise and care.
          </p>
        </div>

        {/* Therapists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Marriage Counselor Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={femaleTherapist}
                alt="Marriage Counselor"
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Marriage Counselor</h3>
              <p className="text-gray-600 mb-4">
                Specializing in relationship dynamics, communication, and conflict resolution. Helping couples build stronger, healthier relationships.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                View Profile
              </button>
            </div>
          </div>

          {/* Psychologist Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={maleTherapist}
                alt="Psychologist"
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clinical Psychologist</h3>
              <p className="text-gray-600 mb-4">
                Expert in cognitive behavioral therapy and mental health assessment. Providing evidence-based treatment for various psychological conditions.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                View Profile
              </button>
            </div>
          </div>

          {/* Mental Health Therapist Card */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={secondFemale}
                alt="Mental Health Therapist"
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mental Health Therapist</h3>
              <p className="text-gray-600 mb-4">
                Specializing in anxiety, depression, and stress management. Offering personalized therapy approaches to support your mental wellness.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapySection;
