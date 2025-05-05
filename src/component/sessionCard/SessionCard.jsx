import { FaCalendarAlt, FaClock, FaUserMd, FaVideo, FaUser, FaStickyNote } from 'react-icons/fa';

const SessionCard = ({ therapist, date, time, status, client, clientImage, duration, type, notes, isTherapist }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-600';
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'Video Call':
        return <FaVideo className="text-blue-500" />;
      case 'In-Person':
        return <FaUser className="text-green-500" />;
      default:
        return <FaUserMd className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-50 rounded-lg">
            {getSessionTypeIcon(type)}
          </div>
          <span className="text-xs md:text-sm text-gray-500 hidden sm:block">{type}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
          <img 
            src={clientImage} 
            alt={isTherapist ? client : therapist}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-800 text-sm md:text-base">
            {isTherapist ? client : therapist}
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            {isTherapist ? 'Client' : 'Therapist'}
          </p>
        </div>
      </div>

      {notes && (
        <div className="mb-4 md:mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaStickyNote className="text-gray-500" />
            <span className="text-xs md:text-sm text-gray-500">Notes</span>
          </div>
          <p className="text-sm md:text-base text-gray-700">{notes}</p>
        </div>
      )}

      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <FaCalendarAlt className="text-gray-500 text-sm md:text-base" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-800 text-sm md:text-base">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <FaClock className="text-gray-500 text-sm md:text-base" />
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-500">Time & Duration</p>
            <p className="font-medium text-gray-800 text-sm md:text-base">{time} • {duration}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6 flex gap-2 md:gap-3">
        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 md:px-4 rounded-lg transition-colors text-sm md:text-base">
          {isTherapist ? 'Start Session' : 'Join Session'}
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 md:px-4 rounded-lg transition-colors text-sm md:text-base">
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default SessionCard;

