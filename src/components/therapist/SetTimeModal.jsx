import { useState, useEffect } from 'react';
import { FaTimes, FaClock, FaCalendarAlt, FaBook, FaSave } from 'react-icons/fa';

const SetTimeModal = ({ session, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    scheduledTime: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Time slots for scheduling
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  useEffect(() => {
    if (session) {
      setFormData({
        scheduledTime: session.scheduledTime || session.preferredTime || '',
        notes: session.notes || ''
      });
    }
  }, [session]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Please select a time for this session';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log('💾 Saving session time for session:', session.id, 'with data:', formData);

    try {
      await onSave(formData);
      console.log('✅ Session time saved successfully');
    } catch (error) {
      console.error('❌ Error saving session time:', error);
      setErrors({ submit: 'Failed to save session time. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (error) {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Set Session Time
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Session Details */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {session.clientName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{session.clientName}</h4>
                <p className="text-sm text-gray-600">{session.therapyType === 'video' ? 'Video Call' : 'In-Person'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaCalendarAlt />
              <span>{formatDate(session.sessionDate)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock />
              <span>Preferred time: {formatTime(session.preferredTime)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.submit}
            </div>
          )}

          <div className="space-y-4">
            {/* Scheduled Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" />
                Set Session Time *
              </label>
              
              <select
                value={formData.scheduledTime}
                onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.scheduledTime ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select a time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {formatTime(time)}
                  </option>
                ))}
              </select>
              
              {errors.scheduledTime && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>
              )}
              
              {formData.scheduledTime && formData.scheduledTime !== session.preferredTime && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <strong>Note:</strong> This time differs from the client&#39;s preferred time ({formatTime(session.preferredTime)})
                </div>
              )}
            </div>

            {/* Session Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBook className="inline mr-2" />
                Session Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={4}
                placeholder="Add any notes about this session, preparation details, or special instructions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="mt-1 text-xs text-gray-500">
                These notes will be visible in your session history
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaSave />
              {loading ? 'Saving...' : 'Set Time'}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-blue-800 mb-2">💡 Tips:</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Consider your schedule and buffer time between sessions</li>
              <li>• Notify clients if the time differs from their preference</li>
              <li>• Add preparation notes to help you get ready for the session</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetTimeModal;