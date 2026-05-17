import React, { useState } from 'react';
import axios from '../api';
import { UserPlus, Shield } from 'lucide-react';

const AdminSettings = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post('/api/auth/register', formData);
      setMessage({ type: 'success', text: res.data.message });
      setFormData({ username: '', password: '' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to create user' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-purple-100 p-3 rounded-xl">
          <Shield size={28} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Settings</h2>
          <p className="text-slate-500 text-sm">Manage system access and administrators</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
          <UserPlus className="mr-2 text-purple-600" size={20} />
          Create New Admin User
        </h3>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg text-sm border ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Username</label>
            <input 
              type="text" 
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="e.g. librarian_jane"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-md disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
