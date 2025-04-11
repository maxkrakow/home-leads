import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function SettingsPage({ currentUser }) {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    notificationPreferences: {
      email: true,
      sms: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    async function fetchUserProfile() {
      if (!currentUser) return;

      try {
        setLoading(true);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile({
            name: userData.name || '',
            email: userData.email || currentUser.email || '',
            phone: userData.phone || '',
            notificationPreferences: userData.notificationPreferences || {
              email: true,
              sms: false,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setMessage({
          text: "Failed to load profile information. Please try again.",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setSaving(true);
      const userDocRef = doc(db, "users", currentUser.uid);
      
      await updateDoc(userDocRef, {
        name: profile.name,
        phone: profile.phone,
        notificationPreferences: profile.notificationPreferences,
        updatedAt: new Date()
      });

      setMessage({
        text: "Settings updated successfully!",
        type: "success"
      });

      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        text: "Failed to update settings. Please try again.",
        type: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      {message.text && (
        <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-800/30 text-green-400 ring-1 ring-green-400/30' : 'bg-red-800/30 text-red-400 ring-1 ring-red-400/30'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 ring-1 ring-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email"
                    name="email"
                    type="checkbox"
                    checked={profile.notificationPreferences.email}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email" className="font-medium text-gray-700">Email Notifications</label>
                  <p className="text-gray-500">Receive lead notifications via email</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sms"
                    name="sms"
                    type="checkbox"
                    checked={profile.notificationPreferences.sms}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded bg-white"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="sms" className="font-medium text-gray-700">SMS Notifications</label>
                  <p className="text-gray-500">Receive lead notifications via text message</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 focus:ring-offset-gray-800"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage; 