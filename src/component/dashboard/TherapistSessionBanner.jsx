import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaCalendarAlt, FaClock, FaVideo, FaExclamationCircle, FaUser } from 'react-icons/fa';
import { format, parseISO, differenceInMinutes, differenceInSeconds } from 'date-fns';

const TherapistSessionBanner = ({ session }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        if (!session) return;

        const calculateTimeLeft = () => {
            const { date, scheduledTime } = session;

            // Construct full session date object
            let sessionDate = parseISO(date);

            // Simple robust time parsing
            if (scheduledTime) {
                const timeParts = scheduledTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                if (timeParts) {
                    let hours = parseInt(timeParts[1], 10);
                    const minutes = parseInt(timeParts[2], 10);
                    const meridian = timeParts[3];

                    if (meridian) {
                        if (meridian.toUpperCase() === 'PM' && hours < 12) hours += 12;
                        if (meridian.toUpperCase() === 'AM' && hours === 12) hours = 0;
                    }

                    sessionDate.setHours(hours, minutes, 0, 0);
                }
            }

            const now = new Date();
            const diffInSeconds = differenceInSeconds(sessionDate, now);
            const diffInMinutes = differenceInMinutes(sessionDate, now);

            if (diffInSeconds <= 0) {
                // Session has started or passed (within a reasonable window, or just 'happening')
                // For simplicity, if it's negative but within e.g. 1 hour, we call it live
                if (diffInMinutes > -60) {
                    setIsLive(true);
                    setIsUrgent(true);
                    setTimeLeft("In Progress");
                } else {
                    // Session ended
                    setIsLive(false);
                    setIsUrgent(false);
                    setTimeLeft("Completed");
                }
            } else {
                setIsLive(false);
                // Urgent if less than 5 minutes away
                setIsUrgent(diffInMinutes < 5);

                // Format countdown
                const h = Math.floor(diffInSeconds / 3600);
                const m = Math.floor((diffInSeconds % 3600) / 60);
                const s = diffInSeconds % 60;

                if (h > 0) {
                    setTimeLeft(`${h}h ${m}m ${s}s`);
                } else if (m > 0) {
                    setTimeLeft(`${m}m ${s}s`);
                } else {
                    setTimeLeft(`${s}s`);
                }
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [session]);

    if (!session) return null;

    const { date, scheduledTime, duration, clientId, therapyType } = session;
    // Handle cases where clientId might not be populated or is raw ID
    const clientName = clientId && typeof clientId === 'object'
        ? `${clientId.firstName} ${clientId.lastName}`
        : 'Unknown Client';

    const formattedDate = format(parseISO(date), 'EEEE, MMMM do, yyyy');

    // Dynamic styles based on urgent state
    const bgGradient = isUrgent
        ? "bg-gradient-to-r from-red-600 to-orange-600"
        : "bg-gradient-to-r from-teal-600 to-emerald-600"; // Therapist gets Teal/Emerald theme instead of Blue

    const badgeColor = isUrgent
        ? "text-red-600"
        : "text-teal-600";

    const iconColor = isUrgent
        ? "text-red-100"
        : "text-teal-200";

    return (
        <div className={`w-full ${bgGradient} rounded-2xl shadow-lg p-6 mb-8 text-white relative overflow-hidden transition-colors duration-500`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold border border-white/10 uppercase tracking-wider flex items-center gap-2`}>
                            {isLive ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                    </span>
                                    Happening Now
                                </>
                            ) : isUrgent ? (
                                <>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    Starting Soon
                                </>
                            ) : (
                                "Upcoming Session"
                            )}
                        </span>

                        {/* Timer Badge */}
                        {!isLive && timeLeft && (
                            <span className={`px-3 py-1 ${isUrgent ? 'bg-red-800/40 border-red-400/30' : 'bg-teal-800/40 border-teal-400/30'} backdrop-blur-sm rounded-full text-xs font-mono font-medium border text-white flex items-center gap-1.5`}>
                                <FaClock className="text-xs" />
                                Starts in: {timeLeft}
                            </span>
                        )}

                        <span className={`flex items-center gap-1.5 text-xs font-medium ${isUrgent ? 'text-red-100' : 'text-teal-100'}`}>
                            <FaClock className={iconColor} />
                            {duration} mins
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        {therapyType || 'General'} Session
                    </h2>

                    <p className={`${isUrgent ? 'text-red-100' : 'text-teal-100'} text-lg mb-4 flex items-center gap-2`}>
                        <FaUser className="opacity-80" /> Client: {clientName}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <FaCalendarAlt className={iconColor} />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <FaClock className={iconColor} />
                            <span>{scheduledTime}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button className={`px-6 py-3 bg-white ${badgeColor} font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-md flex items-center justify-center gap-2`}>
                        <FaVideo />
                        Join Call
                    </button>
                    <button className={`px-6 py-3 ${isUrgent ? 'bg-red-800/40 hover:bg-red-800/60' : 'bg-teal-800/40 hover:bg-teal-800/60'} text-white font-medium rounded-xl transition-colors backdrop-blur-sm border border-white/10 text-center`}>
                        Client Details
                    </button>
                </div>
            </div>

            {/* Urgent Warning Icon Background - subtle */}
            {isUrgent && !isLive && (
                <FaExclamationCircle className="absolute -bottom-6 right-20 text-9xl text-white opacity-5 pointer-events-none" />
            )}
        </div>
    );
};

TherapistSessionBanner.propTypes = {
    session: PropTypes.shape({
        date: PropTypes.string.isRequired,
        scheduledTime: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        therapyType: PropTypes.string,
        clientId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                firstName: PropTypes.string,
                lastName: PropTypes.string
            })
        ]).isRequired
    }).isRequired
};

export default TherapistSessionBanner;
