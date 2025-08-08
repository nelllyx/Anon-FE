import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaClock, FaCalendarAlt, FaVideo, FaMapMarkerAlt, FaBook } from 'react-icons/fa';

const SessionModal = ({ session, onClose, onSave, clients = [] }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video',
    notes: '',
    status: 'upcoming'
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

  const sessionTypes = [
    { value: 'video', label: 'Video Call', icon: <FaVideo /> },
    { value: 'in-person', label: 'In-Person', icon: <FaMapMarkerAlt /> }
  ];

  const durations = [30, 45, 60, 90, 120];

  useEffect(() => {
    if (session) {
      setFormData({
        clientId: session.clientId || '',
        clientName: session.clientName || '',
        date: session.date || '',
        time: session.time || '',
        duration: session.duration || 60,
        type: session.type || 'video',
        notes: session.notes || '',
        status: session.status || 'upcoming'
      });
    }
  }, [session]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName && !formData.clientId) {
      newErrors.client = 'Client is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    // Validate date is not in the past
    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDate < now && session?.isNew) {
      newErrors.datetime = 'Cannot schedule sessions in the past';
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

    try {
      const token = sessionStorage.getItem('token');
      const url = session?.isNew 
        ? 'http://localhost:3000/api/v1/therapist/sessions'
        : `http://localhost:3000/api/v1/therapist/sessions/${session.id}`;
      
      const method = session?.isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          clientId: formData.clientId || undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.session);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to save session' });
      }
    } catch (error) {
      console.error('Error saving session:', error);
      setErrors({ submit: 'Failed to save session. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (e) => {
    const selectedClientId = e.target.value;
    const selectedClient = clients.find(client => client.id === selectedClientId);
    
    setFormData({
      ...formData,
      clientId: selectedClientId,
      clientName: selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            {session?.isNew ? 'Schedule New Session' : 'Edit Session'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.submit}
            </div>
          )}

          {errors.datetime && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.datetime}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Client
              </label>
              
              {clients.length > 0 ? (
                <select
                  value={formData.clientId}
                  onChange={handleClientSelect}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.client ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  placeholder="Enter client name"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.client ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
              )}
              
              {errors.client && (
                <p className="mt-1 text-sm text-red-600">{errors.client}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" />
                Time
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.time ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.duration ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                {durations.map(duration => (
                  <option key={duration} value={duration}>{duration} minutes</option>
                ))}
              </select>
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type
              </label>
              <div className="space-y-2">
                {sessionTypes.map(type => (
                  <label key={type.value} className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status (for editing existing sessions) */}
            {!session?.isNew && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>
            )}

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBook className="inline mr-2" />
                Session Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={4}
                placeholder="Add any notes about this session..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (session?.isNew ? 'Schedule Session' : 'Update Session')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionModal;