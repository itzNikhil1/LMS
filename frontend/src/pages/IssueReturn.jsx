import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRightLeft, Calendar, Search } from 'lucide-react';

const IssueReturn = () => {
  const [activeTab, setActiveTab] = useState('issue');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [issueData, setIssueData] = useState({ studentIdStr: '', bookIdStr: '', dueDate: '' });
  const [returnData, setReturnData] = useState({ issueId: '' });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/transactions');
      setTransactions(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Default due date to 14 days from now
    const date = new Date();
    date.setDate(date.getDate() + 14);
    setIssueData(prev => ({ ...prev, dueDate: date.toISOString().split('T')[0] }));
  }, []);

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5001/api/transactions/issue', issueData);
      setSuccess('Book issued successfully!');
      setIssueData({ ...issueData, studentIdStr: '', bookIdStr: '' });
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error issuing book');
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:5001/api/transactions/return', returnData);
      setSuccess(`Book returned successfully! Fine collected: $${res.data.fine}`);
      setReturnData({ issueId: '' });
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error returning book');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Issue & Return Books</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'issue' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => { setActiveTab('issue'); setError(''); setSuccess(''); }}
          >
            Issue Book
          </button>
          <button 
            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'return' ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => { setActiveTab('return'); setError(''); setSuccess(''); }}
          >
            Return Book
          </button>
        </div>

        {/* Forms Container */}
        <div className="p-6 md:p-8">
          {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
          {success && <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100">{success}</div>}

          {activeTab === 'issue' ? (
            <form onSubmit={handleIssueSubmit} className="max-w-2xl mx-auto space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Student ID*</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={issueData.studentIdStr} 
                      onChange={(e) => setIssueData({...issueData, studentIdStr: e.target.value})} 
                      required 
                      placeholder="e.g. STU001"
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Book ID*</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={issueData.bookIdStr} 
                      onChange={(e) => setIssueData({...issueData, bookIdStr: e.target.value})} 
                      required 
                      placeholder="e.g. BOK001"
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date*</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={issueData.dueDate} 
                    onChange={(e) => setIssueData({...issueData, dueDate: e.target.value})} 
                    required 
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                  <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-md">
                  Issue Book Now
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleReturnSubmit} className="max-w-2xl mx-auto space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Transaction ID*</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={returnData.issueId} 
                    onChange={(e) => setReturnData({...returnData, issueId: e.target.value})} 
                    required 
                    placeholder="e.g. ISSUE168..."
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">Find the Issue ID from the active transactions table below.</p>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors shadow-md">
                  Process Return & Calculate Fine
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Active Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mt-8">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Issue ID</th>
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Book</th>
                <th className="p-4 font-semibold">Issue Date</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Fine</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading transactions...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">No transaction records found.</td></tr>
              ) : (
                transactions.slice(0, 10).map((trx) => (
                  <tr key={trx._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800 text-xs font-mono">{trx.issueId}</td>
                    <td className="p-4 text-slate-700">
                      <div>{trx.studentId?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{trx.studentId?.studentId}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      <div>{trx.bookId?.title || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{trx.bookId?.bookId}</div>
                    </td>
                    <td className="p-4 text-slate-600">{new Date(trx.issueDate).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-600">
                      <span className={new Date(trx.dueDate) < new Date() && trx.status === 'Issued' ? 'text-red-600 font-semibold' : ''}>
                        {new Date(trx.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trx.status === 'Returned' ? 'bg-green-100 text-green-700' : 
                        (new Date(trx.dueDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700')
                      }`}>
                        {trx.status === 'Issued' && new Date(trx.dueDate) < new Date() ? 'Overdue' : trx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-700">
                      ${trx.fine || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IssueReturn;
