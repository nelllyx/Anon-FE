import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import PropTypes from 'prop-types';

const TherapistStatsChart = ({ stats }) => {
    const data = [
        { name: 'Completed', value: stats.completed, color: '#10B981' }, // Green-500
        { name: 'Upcoming', value: stats.upcoming, color: '#3B82F6' },  // Blue-500
        { name: 'Cancelled', value: stats.cancelled, color: '#EF4444' }, // Red-500
    ];

    // Filter out zero values to look cleaner
    const activeData = data.filter(item => item.value > 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                    <p className="text-sm font-medium text-gray-800">{payload[0].name}</p>
                    <p className="text-xs text-gray-500">
                        {payload[0].value} sessions
                    </p>
                </div>
            );
        }
        return null;
    };

    CustomTooltip.propTypes = {
        active: PropTypes.bool,
        payload: PropTypes.arrayOf(PropTypes.object),
    };

    if (activeData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Weekly Overview</h3>
                <p className="text-sm text-gray-500">No session data available for this week yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Overview</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={activeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {activeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => (
                                <span className="text-sm text-gray-600 ml-1">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Descriptive Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <p className="text-xs text-gray-500">Completed</p>
                        <p className="font-semibold text-green-600">{stats.completed}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Upcoming</p>
                        <p className="font-semibold text-blue-600">{stats.upcoming}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Missed</p>
                        <p className="font-semibold text-red-600">{stats.cancelled}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

TherapistStatsChart.propTypes = {
    stats: PropTypes.shape({
        completed: PropTypes.number.isRequired,
        upcoming: PropTypes.number.isRequired,
        cancelled: PropTypes.number.isRequired,
    }).isRequired,
};

export default TherapistStatsChart;
