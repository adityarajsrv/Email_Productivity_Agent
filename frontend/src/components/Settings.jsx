import { useState } from 'react';

const Settings = () => {
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'user@email.com',
    signature: 'Best regards, John'
  });

  const [aiPreferences, setAiPreferences] = useState({
    defaultTone: 'Professional',
    emailLength: 'Medium',
    includeGreetings: true
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    draftReminders: true,
    weeklySummary: false
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAIPreferenceChange = (field, value) => {
    setAiPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    if (!security.currentPassword || !security.newPassword) {
      alert('Please fill in both current and new password');
      return;
    }
    if (security.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }
    alert('Password changed successfully!');
    setSecurity({ currentPassword: '', newPassword: '' });
  };

  const handleSaveAllSettings = () => {
    if (!profile.fullName.trim() || !profile.email.trim()) {
      alert('Please fill in all required profile fields');
      return;
    }
    console.log('Saving settings:', { profile, aiPreferences, notifications });
    alert('All settings saved successfully!');
  };

  const toneOptions = ['Professional', 'Casual', 'Friendly', 'Formal'];
  const lengthOptions = ['Short', 'Medium', 'Long', 'Detailed'];

  return (
    <div className="px-6 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-md text-gray-600 mt-2">Manage your account and preferences</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
          <p className="text-sm text-gray-600 mb-6">Update your personal information</p>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => handleProfileChange('fullName', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Signature</label>
              <textarea
                value={profile.signature}
                onChange={(e) => handleProfileChange('signature', e.target.value)}
                rows="2"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Preferences</h2>
          <p className="text-sm text-gray-600 mb-6">Customize AI behavior</p>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Default Tone</label>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => handleAIPreferenceChange('defaultTone', tone)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                      aiPreferences.defaultTone === tone
                        ? 'bg-blue-600 text-white border-blue-600 cursor-pointer'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Email Length</label>
              <div className="flex flex-wrap gap-2">
                {lengthOptions.map((length) => (
                  <button
                    key={length}
                    onClick={() => handleAIPreferenceChange('emailLength', length)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg border ${
                      aiPreferences.emailLength === length
                        ? 'bg-blue-600 text-white border-blue-600 cursor-pointer'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Include Greetings</h3>
                <p className="text-sm text-gray-600">Add &apos;Dear&apos; and sign-offs</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiPreferences.includeGreetings}
                  onChange={() => handleAIPreferenceChange('includeGreetings', !aiPreferences.includeGreetings)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
          <p className="text-sm text-gray-600 mb-6">Manage notification preferences</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive email updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={() => handleNotificationToggle('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Draft Reminders</h3>
                <p className="text-sm text-gray-600">Remind me about drafts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.draftReminders}
                  onChange={() => handleNotificationToggle('draftReminders')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Weekly Summary</h3>
                <p className="text-sm text-gray-600">Weekly activity report</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.weeklySummary}
                  onChange={() => handleNotificationToggle('weeklySummary')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
          <p className="text-sm text-gray-600 mb-6">Manage your account security</p>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={security.currentPassword}
                onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={security.newPassword}
                onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>
            <button 
              onClick={handleChangePassword}
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg border border-blue-600 hover:bg-blue-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button 
          onClick={handleSaveAllSettings}
          className="cursor-pointer px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg border border-blue-600 hover:bg-blue-700 transition-colors"
        >
          Save All Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;