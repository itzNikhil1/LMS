import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Book, Users, ArrowUpRight, DollarSign, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon, color, bgColor }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
    <div className={`p-4 rounded-full ${bgColor}`}>
      {React.cloneElement(icon, { className: color, size: 24 })}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    booksIssued: 0,
    totalFineCollected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/stats');
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Books" 
          value={stats.totalBooks} 
          icon={<Book />} 
          color="text-blue-600" 
          bgColor="bg-blue-100" 
        />
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<Users />} 
          color="text-green-600" 
          bgColor="bg-green-100" 
        />
        <StatCard 
          title="Books Issued" 
          value={stats.booksIssued} 
          icon={<ArrowUpRight />} 
          color="text-orange-600" 
          bgColor="bg-orange-100" 
        />
        <StatCard 
          title="Total Fine ($)" 
          value={stats.totalFineCollected} 
          icon={<DollarSign />} 
          color="text-pink-600" 
          bgColor="bg-pink-100" 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Activity className="mr-2 text-purple-600" size={20} />
            Recent Activities
          </h3>
          <button className="text-sm text-purple-600 font-medium hover:underline">View All</button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {/* Mock recent activities */}
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <ArrowUpRight size={18} className="text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-800">Book <span className="font-semibold">"Clean Code"</span> was issued to <span className="font-semibold">John Doe</span></p>
                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Users size={18} className="text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-800">New student <span className="font-semibold">Jane Smith</span> was registered</p>
                <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Book size={18} className="text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-800">5 new copies of <span className="font-semibold">"Design Patterns"</span> added to inventory</p>
                <p className="text-xs text-slate-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
