import React from 'react';
import { FiSettings } from 'react-icons/fi';

const Settings = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center mb-4">
        <FiSettings className="text-2xl text-pink-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Change Admin Email</label>
          <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Enter new admin email" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Change Password</label>
          <input type="password" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" placeholder="Enter new password" />
        </div>
        <div>
          <button className="bg-pink-600 text-white px-6 py-2 rounded-md shadow hover:bg-pink-700 transition">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 