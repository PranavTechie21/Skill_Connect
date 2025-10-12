import React, { useState } from 'react';
import AdminBackButton from '@/components/AdminBackButton';
import { useNavigate } from 'react-router-dom';
import {
  Settings, Shield, Bell, Mail, Lock, Globe, Users, Database,
  Palette, Zap, Server, Cloud, Key, Eye, EyeOff, Save, CheckCircle,
  AlertCircle, Info, Smartphone, Clock, CreditCard, Package, Activity,
  FileText, HelpCircle, ChevronRight, ToggleLeft, ToggleRight, Upload
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const ToggleSwitch = ({ enabled, onChange }: any) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 ${
        enabled ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="mb-4">
          <AdminBackButton />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/50">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-gray-600 mt-1">Manage platform-wide configuration and preferences</p>
          </div>
        </div>

        {/* Save Success Banner */}
        {savedSuccess && (
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-4 flex items-center gap-3 animate-slide-down">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-bold text-green-900">Settings Saved Successfully!</p>
              <p className="text-sm text-green-700">Your changes have been applied.</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">General Settings</h2>
                <p className="text-gray-600 text-sm">Basic system configuration</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Platform Name</label>
                <input
                  type="text"
                  defaultValue="SkillConnect Job Board"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  defaultValue="admin@skillconnect.com"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Platform Description</label>
              <textarea
                defaultValue="Connect local job seekers with employers based on skills and location."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Default Language</label>
                <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all font-medium cursor-pointer">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Timezone</label>
                <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all font-medium cursor-pointer">
                  <option>UTC</option>
                  <option>EST (UTC-5)</option>
                  <option>PST (UTC-8)</option>
                  <option>IST (UTC+5:30)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-bold text-gray-900">Maintenance Mode</p>
                  <p className="text-sm text-gray-600">Disable public access temporarily</p>
                </div>
              </div>
              <ToggleSwitch enabled={maintenanceMode} onChange={setMaintenanceMode} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Notifications & Email</h2>
                <p className="text-gray-600 text-sm">Configure notification preferences</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-bold text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive email alerts for important events</p>
                  </div>
                </div>
                <ToggleSwitch enabled={emailNotifications} onChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-bold text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Get instant push notifications</p>
                  </div>
                </div>
                <ToggleSwitch enabled={pushNotifications} onChange={setPushNotifications} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Server</label>
                <input
                  type="text"
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Port</label>
                <input
                  type="text"
                  placeholder="587"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Username</label>
                <input
                  type="text"
                  placeholder="your-email@example.com"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">SMTP Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all font-medium pr-12"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
              <Mail className="w-5 h-5" />
              Test Email Configuration
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Security Settings</h2>
                <p className="text-gray-600 text-sm">Manage authentication and security</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-red-300 transition-all">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
              </div>
              <ToggleSwitch enabled={twoFactorAuth} onChange={setTwoFactorAuth} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  defaultValue="5"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password Requirements</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-900">Minimum 8 characters</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-900">Uppercase & lowercase</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-900">At least one number</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-900">Special character</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200 flex items-start gap-3">
              <Info className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-yellow-900">Security Recommendation</p>
                <p className="text-sm text-yellow-800 mt-1">
                  We recommend enabling two-factor authentication for all admin accounts and regularly reviewing login activity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Backup */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Database & Backup</h2>
                <p className="text-gray-600 text-sm">Manage data storage and backups</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-green-300 transition-all">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-bold text-gray-900">Automatic Backups</p>
                  <p className="text-sm text-gray-600">Daily automated database backups</p>
                </div>
              </div>
              <ToggleSwitch enabled={autoBackup} onChange={setAutoBackup} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200">
                <Server className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-sm font-semibold text-gray-600 mb-1">Database Size</p>
                <p className="text-2xl font-black text-gray-900">2.4 GB</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200">
                <Activity className="w-8 h-8 text-purple-600 mb-3" />
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Records</p>
                <p className="text-2xl font-black text-gray-900">156,892</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200">
                <Cloud className="w-8 h-8 text-green-600 mb-3" />
                <p className="text-sm font-semibold text-gray-600 mb-1">Last Backup</p>
                <p className="text-2xl font-black text-gray-900">2h ago</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                <Database className="w-5 h-5" />
                Backup Now
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">
                <Upload className="w-5 h-5" />
                Restore from Backup
              </button>
            </div>
          </div>
        </div>

        {/* API & Integration */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">API & Integration</h2>
                <p className="text-gray-600 text-sm">Manage API keys and integrations</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">API Key</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value="sk_live_51HxY2KJK3m9zJ5..."
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-mono text-sm"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  Regenerate
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-gray-200 rounded-2xl hover:border-orange-300 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-6 h-6 text-orange-600" />
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
                </div>
                <p className="font-bold text-gray-900">Payment Gateway</p>
                <p className="text-sm text-gray-600">Stripe Integration</p>
              </div>
              <div className="p-4 border-2 border-gray-200 rounded-2xl hover:border-orange-300 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <Mail className="w-6 h-6 text-orange-600" />
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Active</span>
                </div>
                <p className="font-bold text-gray-900">Email Service</p>
                <p className="text-sm text-gray-600">SendGrid Integration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-xl border-2 border-gray-100">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-gray-400" />
            <div>
              <p className="font-bold text-gray-900">Need Help?</p>
              <p className="text-sm text-gray-600">Check our documentation or contact support</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Save className="w-6 h-6" />
            Save All Settings
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;