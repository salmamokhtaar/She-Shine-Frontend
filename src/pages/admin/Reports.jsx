import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';

const Reports = () => {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center mb-4">
        <FiBarChart2 className="text-2xl text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Total Sales</div>
          <div className="text-2xl font-bold text-gray-900">$12,340</div>
        </div>
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Orders</div>
          <div className="text-2xl font-bold text-gray-900">1,234</div>
        </div>
        <div className="bg-gradient-to-br from-white to-green-50 rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">New Users</div>
          <div className="text-2xl font-bold text-gray-900">56</div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
        <div className="mb-4 text-lg font-medium text-gray-900">Sales Overview (Sample Chart)</div>
        <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded">
          <span className="text-gray-400">[Chart Placeholder]</span>
        </div>
      </div>
    </div>
  );
};

export default Reports; 