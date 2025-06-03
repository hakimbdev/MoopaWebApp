import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Shield, Bell, CheckCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
  ];

  return (
    <AppLayout title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {showSuccess && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 flex items-start">
            <CheckCircle className="text-green-500 mt-0.5" size={16} />
            <p className="ml-3 text-sm text-green-700">Settings updated successfully</p>
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 md:gap-6">
          <Card className="md:col-span-1">
            <CardContent className="p-0">
              <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 p-2 overflow-x-auto md:overflow-visible">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors",
                      activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-900' 
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                    onClick={() => setActiveTab(tab.id as any)}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
            
            <CardFooter className="border-t border-gray-100 p-4">
              <Button
                variant="outline"
                className="w-full text-gray-700"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>
          
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Input
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          leftIcon={<User size={18} />}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        leftIcon={<Mail size={18} />}
                        disabled={!isEditing}
                      />
                      
                      <Input
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        leftIcon={<Phone size={18} />}
                        disabled={!isEditing}
                      />
                      
                      <div className="sm:col-span-2">
                        <Input
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      {isEditing && (
                        <div className="sm:col-span-2 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto sm:flex-1"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="w-full sm:w-auto sm:flex-1"
                            isLoading={isSaving}
                          >
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <Input
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        leftIcon={<Lock size={18} />}
                      />
                      
                      <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        leftIcon={<Lock size={18} />}
                      />
                      
                      <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        leftIcon={<Lock size={18} />}
                      />
                      
                      <div className="mt-6">
                        <Button
                          type="submit"
                          isLoading={isSaving}
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-500">Receive transaction alerts via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            name="emailNotifications"
                            checked={formData.emailNotifications}
                            onChange={handleInputChange}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium text-gray-900">Push Notifications</h4>
                          <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            name="pushNotifications"
                            checked={formData.pushNotifications}
                            onChange={handleInputChange}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                          <p className="text-sm text-gray-500">Receive transaction alerts via SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            name="smsNotifications"
                            checked={formData.smsNotifications}
                            onChange={handleInputChange}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                        </label>
                      </div>
                      
                      <div className="mt-6">
                        <Button
                          type="submit"
                          isLoading={isSaving}
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Settings;