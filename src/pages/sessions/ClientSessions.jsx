import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { FaCalendarAlt, FaHistory, FaBan, FaRedo, FaCheckCircle, FaTimesCircle, FaBars } from 'react-icons/fa';
import SideBar from '../../component/siderbar/SideBar';
import SessionCard from '../../component/sessionCard/SessionCard';
import { useAuthenticatedFetch } from '../../utils/api';

const ClientSessions = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const authenticatedFetch = useAuthenticatedFetch();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const response = await authenticatedFetch('http://localhost:3000/api/v1/client/sessions', {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setSessions(data.data.Sessions || []);
            } else {
                setError('Failed to fetch sessions');
            }
        } catch (err) {
            console.error('Error fetching sessions:', err);
            setError('An error occurred while loading sessions');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate stats
    const stats = {
        total: sessions.length,
        upcoming: sessions.filter(s => s.status === 'upcoming').length,
        completed: sessions.filter(s => s.status === 'completed').length,
        cancelled: sessions.filter(s => s.status === 'cancelled').length
    };

    const filterSessions = (status) => {
        return sessions.filter(session => {
            if (status === 'upcoming') return session.status === 'upcoming';
            if (status === 'completed') return session.status === 'completed';
            if (status === 'missed') return session.status === 'cancelled';
            if (status === 'rescheduled') return session.status === 'rescheduled';
            return false;
        });
    };

    const tabs = [
        { id: 'upcoming', label: 'Upcoming', icon: <FaCalendarAlt />, count: stats.upcoming },
        { id: 'completed', label: 'Completed', icon: <FaHistory />, count: stats.completed },
        { id: 'missed', label: 'Cancelled', icon: <FaBan />, count: stats.cancelled },
        { id: 'rescheduled', label: 'Rescheduled', icon: <FaRedo />, count: 0 }, // Assuming 0 for now as rescheduling logic varies
    ];

    const filteredSessions = filterSessions(activeTab);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md md:hidden hover:bg-gray-50 transition-colors"
            >
                <FaBars className="text-gray-600" />
            </button>

            {/* Fixed Sidebar */}
            <div className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-2xl z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <SideBar isTherapist={false} />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 ml-0 md:ml-64 h-screen overflow-y-auto bg-gray-50/50">
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

                    {/* Header & Stats */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Session History</h1>
                            <p className="text-gray-500 mt-1">Track your therapy journey and manage upcoming appointments.</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FaCalendarAlt />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Upcoming</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcoming}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <FaCalendarAlt />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Completed</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                    <FaCheckCircle />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Cancelled</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.cancelled}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                                    <FaTimesCircle />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs & Content */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-2 p-1 bg-gray-200/50 rounded-xl w-fit">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-gray-100 text-gray-900' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-32">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl text-center">
                                <p>{error}</p>
                                <button
                                    onClick={fetchSessions}
                                    className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <>
                                {filteredSessions.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {filteredSessions.map((session, index) => (
                                            <SessionCard
                                                key={index}
                                                therapist={`${session.therapistId.firstName} ${session.therapistId.lastName}`}
                                                date={format(parseISO(session.date), 'do MMMM, yyyy')}
                                                time={session.scheduledTime}
                                                status={session.status}
                                                client={`${session.therapistId.firstName} ${session.therapistId.lastName}`}
                                                clientImage={session.therapistId.profile.avatar}
                                                duration={session.duration}
                                                type={session.therapyType}
                                                notes={session.notes}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                            <FaCalendarAlt className="text-gray-300 text-3xl" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No sessions found</h3>
                                        <p className="text-gray-500 max-w-xs mx-auto">
                                            You don&apos;t have any {activeTab.replace('-', ' ')} sessions to display at the moment.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientSessions;
