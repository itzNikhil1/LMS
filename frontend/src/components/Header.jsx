import React, { useContext, useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LogOut, BookOpen, Users } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ books: [], students: [] });
  const [isSearching, setIsSearching] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery(''); // Clear search if clicked outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ books: [], students: [] });
        return;
      }
      setIsSearching(true);
      try {
        const [booksRes, studentsRes] = await Promise.all([
          axios.get('/api/books'),
          axios.get('/api/students')
        ]);
        
        const q = searchQuery.toLowerCase();
        const filteredBooks = booksRes.data.filter(b => 
          b.title.toLowerCase().includes(q) || 
          b.author.toLowerCase().includes(q) || 
          b.bookId.toLowerCase().includes(q)
        ).slice(0, 5); // Limit to 5
        
        const filteredStudents = studentsRes.data.filter(s => 
          s.name.toLowerCase().includes(q) || 
          s.studentId.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        ).slice(0, 5); // Limit to 5
        
        setSearchResults({ books: filteredBooks, students: filteredStudents });
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative" ref={searchRef}>
        <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64 md:w-96 border border-slate-200 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search books or students..." 
            className="bg-transparent border-none outline-none w-full ml-2 text-sm text-slate-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Search Results Dropdown */}
        {searchQuery.trim() && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
            ) : searchResults.books.length === 0 && searchResults.students.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">No results found for "{searchQuery}"</div>
            ) : (
              <div className="py-2">
                {searchResults.books.length > 0 && (
                  <div>
                    <div className="px-4 py-1 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">Books</div>
                    {searchResults.books.map(book => (
                      <div key={book._id} className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center" onClick={() => { navigate('/books'); setSearchQuery(''); }}>
                        <div>
                          <div className="text-sm font-medium text-slate-800">{book.title}</div>
                          <div className="text-xs text-slate-500">{book.author} • {book.bookId}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${book.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {book.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.students.length > 0 && (
                  <div>
                    <div className="px-4 py-1 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">Students</div>
                    {searchResults.students.map(student => (
                      <div key={student._id} className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center" onClick={() => { navigate('/students'); setSearchQuery(''); }}>
                        <div>
                          <div className="text-sm font-medium text-slate-800">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.studentId} • {student.course}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-slate-100 relative text-slate-500 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex items-start space-x-3">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-full"><BookOpen size={16} /></div>
                  <div>
                    <p className="text-sm text-slate-800">3 books are due today.</p>
                    <p className="text-xs text-slate-500 mt-1">Just now</p>
                  </div>
                </div>
                <div className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex items-start space-x-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full"><Users size={16} /></div>
                  <div>
                    <p className="text-sm text-slate-800">New student registered: John Doe</p>
                    <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="p-2 text-center border-t border-slate-100">
                <button className="text-xs text-purple-600 font-medium hover:underline" onClick={() => setShowNotifications(false)}>Mark all as read</button>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div 
            className="flex items-center space-x-3 border-l border-slate-200 pl-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-800">Welcome, Admin</p>
              <p className="text-xs text-slate-500">{user?.username || 'Super Admin'}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 border-2 border-purple-200 flex items-center justify-center overflow-hidden">
              <User size={20} className="text-purple-600" />
            </div>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
              <div className="p-3 border-b border-slate-100 md:hidden bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Welcome, Admin</p>
                <p className="text-xs text-slate-500">{user?.username}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
