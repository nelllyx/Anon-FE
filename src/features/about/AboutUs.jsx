const AboutUs = () => {
  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to making mental health support accessible, professional, and personalized for everyone.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">
                Mental Health is No Joke
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Mental health is not a luxury—it's a necessity. 
                In a world that often misunderstands emotional struggles, we're here to provide a sanctuary of support,
                understanding, and professional care.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">
                Seek Help from Professionals
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Need someone to talk to? Our licensed therapists are available to give you the support you need.
                You can get confidential online consultations and tailored mental health guidance when you sign up at a
                subsidized amount.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 md:p-8">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-4">
                Grow at Your Own Pace
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We recognize that mental health recovery isn't linear. 
                Whether you need a listening ear or comprehensive therapeutic support, we meet you exactly where you are.
                Take the first step. Choose your path. Start healing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;