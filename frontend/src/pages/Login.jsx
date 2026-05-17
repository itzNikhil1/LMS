import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password. Default admin/admin');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-300/30 rounded-full blur-3xl"></div>

      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl flex overflow-hidden relative z-10 mx-4">
        {/* Left Side - Illustration/Branding */}
        <div className="w-1/2 bg-gradient-to-br from-purple-700 to-indigo-900 p-12 text-white hidden md:flex flex-col justify-between relative overflow-hidden">
          {/* Abstract graphic */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <BookOpen size={28} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-wider">LMS Pro</h1>
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">
              Manage your library with intelligence.
            </h2>
            <p className="text-purple-200 text-lg">
              A comprehensive system to track books, students, and transactions effortlessly.
            </p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
            <p className="text-sm text-purple-100 italic">
              "A library is not a luxury but one of the necessities of life."
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your admin credentials.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-slate-50"
                />
                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-slate-50"
                />
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="rounded text-purple-600 focus:ring-purple-500 border-slate-300" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-500">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 disabled:opacity-70 mt-6"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>Demo credentials: admin / admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
