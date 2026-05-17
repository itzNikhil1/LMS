import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ArrowRightLeft, 
  FileBarChart, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Books', path: '/books', icon: <BookOpen size={20} /> },
    { name: 'Students', path: '/students', icon: <Users size={20} /> },
    { name: 'Issue/Return', path: '/issue-return', icon: <ArrowRightLeft size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileBarChart size={20} /> },
    { name: 'Admin', path: '/admin', icon: <Settings size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl hidden md:flex fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
        <div className="bg-purple-600 p-2 rounded-lg">
          <BookOpen size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-wider">LMS MERN </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={logout}
          className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500 hover:text-white transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
