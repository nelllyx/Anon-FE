import femaleTherapist from "../../assets/pexels-emmy.jpg";
import maleTherapist from "../../assets/male.jpg";
import secondFemale from "../../assets/female2.jpg";

const TherapySection = () => {
  return (
    <div className="flex p-3 flex-col justify-center w-full">
      <span className="text-blue-700 text-2xl font-bold text-center ">
        Meet our Therapist
      </span>
      <div className="flex  justify-around p-3 mt-6">
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white h-130">
          <img
            src={femaleTherapist}
            alt="female therapist"
            className="w-full h-1/2"
          ></img>
          <div class="p-6">
            <div class="font-bold text-xl mb-2">Marriage councellor</div>
            <p class="text-gray-700 text-base">
              This is a simple card with a title, a description, and a button
              below.
            </p>
          </div>
        </div>

        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white h-130">
          <img
            src={maleTherapist}
            alt="male therapist"
            className="w-full object-center object-contain  h-1/2"
          ></img>
          <div class="p-6">
            <div class="font-bold text-xl mb-2">Psychologist</div>
            <p class="text-gray-700 text-base">
              This is a simple card with a title, a description, and a button
              below.
            </p>
          </div>
        </div>

        <div className="max-w-sm flex flex-col rounded overflow-hidden shadow-lg bg-white h-130">
          <div className='h-[50%]'>
            <img
              src={secondFemale}
              alt="mental health therapist"
              className="w-full object-center object-contain"
            />
          </div>

          <div class="p-6">
            <div class="font-bold text-xl mb-2">Mental Health</div>
            <p class="text-gray-700 text-base">
              This is a simple card with a title, a description, and a button
              below.
            </p>

            <div className="mt-14">
              <button className="bg-blue-500 font-bold px-6 w-1/2 transition duration-300 text-white ">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapySection;
