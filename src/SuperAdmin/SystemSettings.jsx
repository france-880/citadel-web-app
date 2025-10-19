import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { 
  Settings, 
  Save, 
  Database, 
  Shield, 
  Mail,
  Bell,
  Clock,
  Monitor,
  Server,
  Key
} from "lucide-react";

export default function SystemSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    system: {
      siteName: "University of Cebu - Citadel",
      timezone: "Asia/Manila",
      dateFormat: "MM/DD/YYYY",
      language: "en",
      maintenanceMode: false
    },
    security: {
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireTwoFactor: false,
      maxLoginAttempts: 5,
      lockoutDuration: 15
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      attendanceAlerts: true,
      systemAlerts: true,
      weeklyReports: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: "daily",
      retentionDays: 30,
      cloudBackup: false
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  if (isLoading) {
    return (
      <div className="flex" style={{ paddingLeft: '260px', paddingTop: '70px' }}>
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6 min-h-screen">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064F32]"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const SettingCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-[#064F32]">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex" style={{ paddingLeft: '260px', paddingTop: '70px' }}>
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6 min-h-screen">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064F32]"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex" style={{ paddingLeft: '260px', paddingTop: '70px' }}>
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 min-h-screen bg-gray-50">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#064F32] mb-2">System Settings</h1>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>

          <div className="space-y-6">
            {/* System Settings */}
            <SettingCard title="System Configuration" icon={Monitor}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.system.siteName}
                    onChange={(e) => handleSettingChange('system', 'siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.system.timezone}
                    onChange={(e) => handleSettingChange('system', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                  >
                    <option value="Asia/Manila">Asia/Manila</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select
                    value={settings.system.dateFormat}
                    onChange={(e) => handleSettingChange('system', 'dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.system.language}
                    onChange={(e) => handleSettingChange('system', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="fil">Filipino</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                    className="w-4 h-4 text-[#064F32] border-gray-300 rounded focus:ring-[#064F32]"
                  />
                  <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Enable to put the system in maintenance mode</p>
              </div>
            </SettingCard>

            {/* Security Settings */}
            <SettingCard title="Security Settings" icon={Shield}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                    min="5"
                    max="120"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Minimum Length</label>
                  <input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                    min="6"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                    min="3"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                    min="5"
                    max="60"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.security.requireTwoFactor}
                    onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
                    className="w-4 h-4 text-[#064F32] border-gray-300 rounded focus:ring-[#064F32]"
                  />
                  <span className="text-sm font-medium text-gray-700">Require Two-Factor Authentication</span>
                </label>
              </div>
            </SettingCard>

            {/* Notification Settings */}
            <SettingCard title="Notification Settings" icon={Bell}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                    <p className="text-xs text-gray-500">Send notifications via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    className="w-4 h-4 text-[#064F32] border-gray-300 rounded focus:ring-[#064F32]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                    <p className="text-xs text-gray-500">Send browser push notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    className="w-4 h-4 text-[#064F32] border-gray-300 rounded focus:ring-[#064F32]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Attendance Alerts</p>
                    <p className="text-xs text-gray-500">Alert on attendance issues</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.attendanceAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'attendanceAlerts', e.target.checked)}
                    className="w-4 h-4 text-[#064F32] border-gray-300 rounded focus:ring-[#064F32]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">System Alerts</p>
                    <p className="text-xs text-gray-500">Alert on system issues</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemAlerts}
                    onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
                    className="w-4 h-4 text-[#064F32] border-gray-300 rounded focus:ring-[#064F32]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Weekly Reports</p>
                    <p className="text-xs text-gray-500">Send weekly summary reports</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.weeklyReports}
                    onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
                    className="w-4 h-4 text-[#064F32] border-gray-300 rounded focus:ring-[#064F32]"
                  />
                </div>
              </div>
            </SettingCard>

            {/* Backup Settings */}
            <SettingCard title="Backup Settings" icon={Database}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Automatic Backup</p>
                    <p className="text-xs text-gray-500">Enable automatic system backups</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.backup.autoBackup}
                    onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
                    className="w-4 h-4 text-[#064F32] border-gray-300 rounded focus:ring-[#064F32]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                    <select
                      value={settings.backup.backupFrequency}
                      onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Days</label>
                    <input
                      type="number"
                      value={settings.backup.retentionDays}
                      onChange={(e) => handleSettingChange('backup', 'retentionDays', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#064F32] focus:border-transparent"
                      min="7"
                      max="365"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Cloud Backup</p>
                    <p className="text-xs text-gray-500">Store backups in cloud storage</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.backup.cloudBackup}
                    onChange={(e) => handleSettingChange('backup', 'cloudBackup', e.target.checked)}
                    className="w-4 h-4 text-[#064F32] border-gray-300 rounded focus:ring-[#064F32]"
                  />
                </div>
              </div>
            </SettingCard>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-[#064F32] text-white rounded-lg hover:bg-[#053d27] transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
