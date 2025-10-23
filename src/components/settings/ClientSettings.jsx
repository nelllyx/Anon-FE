import { useState, useEffect } from 'react';
import { getUserData, clearAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react"

const ClientSettings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const navigate = useNavigate();

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
     const [showNewPassword, setShowNewPassword] = useState(false)
     const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Password change form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        sessionReminders: true,
        newMessageAlerts: true,
        marketingEmails: false
    });

    // Privacy settings
    const [privacy, setPrivacy] = useState({
        profileVisibility: 'public',
        showOnlineStatus: true,
        allowDirectMessages: true,
        shareSessionHistory: false
    });

    // Account preferences
    const [preferences, setPreferences] = useState({
        language: 'en',
        timezone: 'UTC',
        theme: 'light',
        autoLogout: 30
    });

    useEffect(() => {
        // Load user preferences from localStorage or API
        const userData = getUserData();
        if (userData) {
            // Load saved preferences if they exist
            const savedNotifications = localStorage.getItem('clientNotifications');
            const savedPrivacy = localStorage.getItem('clientPrivacy');
            const savedPreferences = localStorage.getItem('clientPreferences');

            if (savedNotifications) {
                setNotifications(JSON.parse(savedNotifications));
            }
            if (savedPrivacy) {
                setPrivacy(JSON.parse(savedPrivacy));
            }
            if (savedPreferences) {
                setPreferences(JSON.parse(savedPreferences));
            }
        }
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificationChange = (setting) => {
        setNotifications(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handlePrivacyChange = (setting, value) => {
        setPrivacy(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const handlePreferenceChange = (setting, value) => {
        setPreferences(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const saveNotifications = () => {
        localStorage.setItem('clientNotifications', JSON.stringify(notifications));
        setMessage({ type: 'success', text: 'Notification preferences saved!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const savePrivacy = () => {
        localStorage.setItem('clientPrivacy', JSON.stringify(privacy));
        setMessage({ type: 'success', text: 'Privacy settings saved!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const savePreferences = () => {
        localStorage.setItem('clientPreferences', JSON.stringify(preferences));
        setMessage({ type: 'success', text: 'Account preferences saved!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setIsLoading(false);
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/client/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                   // 'Authorization': Bearer ${localStorage.getItem('token')}
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to change password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while changing password' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('http://localhost:3000/api/v1/client/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                  //  'Authorization': Bearer ${localStorage.getItem('token')}
                }
            });

            if (response.ok) {
                clearAuth();
                navigate('/');
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.message || 'Failed to delete account' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while deleting account' });
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: '👤' },
        { id: 'security', label: 'Security', icon: '🔒' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'privacy', label: 'Privacy', icon: '🛡' },
        { id: 'preferences', label: 'Preferences', icon: '⚙' }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg">
                <div className="border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 p-6">Settings</h2>

                    {/* Tab Navigation */}
                    <div className="flex space-x-1 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {message.text && (
                        <div className={`p-4 mb-6 rounded-lg ${
                            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Account Tab */}
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Username</label>
                                        <p className="text-gray-900">{getUserData()?.username || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="text-gray-900">{getUserData()?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Member Since</label>
                                        <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Account Status</label>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h3>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-red-800 font-medium">Delete Account</h4>
                                            <p className="text-red-600 text-sm mt-1">
                                                Once you delete your account, there is no going back. Please be certain.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                    Change Password
                                </h3>
                                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <label htmlFor="current-password">
                                                Current Password
                                            </label>
                                            <input
                                                name="currentPassword"
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={passwordForm.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                                                required
                                            />
                                            <button
                                                type="button"
                                                //className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-[calc(50%+8px)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className='relative'>
                                        <label htmlFor="new-password">
                                            New Password
                                        </label>
                                        <input
                                            name="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-[calc(50%+8px)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showNewPassword ? <EyeOff className="h-4 w-4"/> :
                                                <Eye className="h-4 w-4"/>}
                                        </button>

                                    </div>
                                    <div className='relative'>
                                        <label htmlFor="confirm-password">
                                            Confirm New Password
                                        </label>
                                        <input
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-[calc(50%+8px)] transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4"/> :
                                                <Eye className="h-4 w-4"/>}
                                        </button>

                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {isLoading ? 'Changing...' : 'Change Password'}
                                    </button>
                                </form>
                            </div>

                            <div className=" pt-3">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h3>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-yellow-800 font-medium">Two-Factor Authentication</h4>
                                            <p className="text-yellow-600 text-sm mt-1">
                                                Add an extra layer of security to your account.
                                            </p>
                                        </div>
                                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                            Enable 2FA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Email Notifications</h4>
                                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications.emailNotifications}
                                            onChange={() => handleNotificationChange('emailNotifications')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications.smsNotifications}
                                            onChange={() => handleNotificationChange('smsNotifications')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Session Reminders</h4>
                                        <p className="text-sm text-gray-600">Get reminded about upcoming sessions</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications.sessionReminders}
                                            onChange={() => handleNotificationChange('sessionReminders')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">New Message Alerts</h4>
                                        <p className="text-sm text-gray-600">Notify when you receive new messages</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications.newMessageAlerts}
                                            onChange={() => handleNotificationChange('newMessageAlerts')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Marketing Emails</h4>
                                        <p className="text-sm text-gray-600">Receive promotional and marketing emails</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications.marketingEmails}
                                            onChange={() => handleNotificationChange('marketingEmails')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={saveNotifications}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Save Notification Preferences
                            </button>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy Settings</h3>

                            <div className="space-y-4">
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Visibility
                                    </label>
                                    <select
                                        value={privacy.profileVisibility}
                                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="friends">Friends Only</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Show Online Status</h4>
                                        <p className="text-sm text-gray-600">Let others see when you&#39;re online</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={privacy.showOnlineStatus}
                                            onChange={() => handlePrivacyChange('showOnlineStatus', !privacy.showOnlineStatus)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Allow Direct Messages</h4>
                                        <p className="text-sm text-gray-600">Allow others to send you direct messages</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={privacy.allowDirectMessages}
                                            onChange={() => handlePrivacyChange('allowDirectMessages', !privacy.allowDirectMessages)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-800">Share Session History</h4>
                                        <p className="text-sm text-gray-600">Allow therapists to see your session history</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={privacy.shareSessionHistory}
                                            onChange={() => handlePrivacyChange('shareSessionHistory', !privacy.shareSessionHistory)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={savePrivacy}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Save Privacy Settings
                            </button>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Preferences</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timezone
                                    </label>
                                    <select
                                        value={preferences.timezone}
                                        onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="EST">Eastern Time</option>
                                        <option value="PST">Pacific Time</option>
                                        <option value="CST">Central Time</option>
                                        <option value="MST">Mountain Time</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Theme
                                    </label>
                                    <select
                                        value={preferences.theme}
                                        onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="auto">Auto</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Auto Logout (minutes)
                                    </label>
                                    <select
                                        value={preferences.autoLogout}
                                        onChange={(e) => handlePreferenceChange('autoLogout', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={15}>15 minutes</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={60}>1 hour</option>
                                        <option value={120}>2 hours</option>
                                        <option value={0}>Never</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={savePreferences}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Save Preferences
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Account</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isLoading}
                                className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSettings;