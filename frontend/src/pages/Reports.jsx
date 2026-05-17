import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Download, Printer, Filter } from 'lucide-react';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

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
  }, []);

  const handleExportMock = (type) => {
    alert(`Mock: Generating ${type} report... (This feature requires a backend PDF/Excel library like pdfkit or exceljs)`);
  };

  // Filter logic
  const filteredTransactions = transactions.filter(trx => {
    let typeMatch = true;
    if (reportType === 'issued') typeMatch = trx.status === 'Issued';
    if (reportType === 'returned') typeMatch = trx.status === 'Returned';
    if (reportType === 'overdue') typeMatch = trx.status === 'Issued' && new Date(trx.dueDate) < new Date();
    
    let dateMatch = true;
    if (dateRange.start) {
      dateMatch = dateMatch && new Date(trx.issueDate) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      // Set end of day for the end date
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && new Date(trx.issueDate) <= endDate;
    }
    
    return typeMatch && dateMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Library Reports</h2>
        
        <div className="flex space-x-3">
          <button onClick={() => handleExportMock('PDF')} className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors border border-red-200">
            <Download size={18} className="mr-2" /> PDF
          </button>
          <button onClick={() => handleExportMock('Excel')} className="flex items-center px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition-colors border border-green-200">
            <Download size={18} className="mr-2" /> Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center px-4 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors border border-slate-200">
            <Printer size={18} className="mr-2" /> Print
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
            <Filter size={16} className="mr-1 text-slate-400" /> Report Type
          </label>
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="all">All Transactions</option>
            <option value="issued">Currently Issued Books</option>
            <option value="returned">Returned Books</option>
            <option value="overdue">Overdue Books</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
            <Calendar size={16} className="mr-1 text-slate-400" /> Date Range (Issue Date)
          </label>
          <div className="flex items-center space-x-2">
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-slate-400">to</span>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button 
          onClick={() => { setReportType('all'); setDateRange({ start: '', end: '' }); }}
          className="px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-200"
        >
          Reset Filters
        </button>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <span className="font-semibold text-slate-700">Showing {filteredTransactions.length} results</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Issue ID</th>
                <th className="p-4 font-semibold">Student Name (ID)</th>
                <th className="p-4 font-semibold">Book Title (ID)</th>
                <th className="p-4 font-semibold">Issue Date</th>
                <th className="p-4 font-semibold">Return/Due Date</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Fine Collected</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Generating report data...</td></tr>
              ) : filteredTransactions.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">No data matches your filters.</td></tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800 text-xs font-mono">{trx.issueId}</td>
                    <td className="p-4 text-slate-700">
                      <span className="font-medium">{trx.studentId?.name || 'Unknown'}</span>
                      <span className="text-xs text-slate-400 ml-2">({trx.studentId?.studentId})</span>
                    </td>
                    <td className="p-4 text-slate-700">
                      <span className="font-medium">{trx.bookId?.title || 'Unknown'}</span>
                      <span className="text-xs text-slate-400 ml-2">({trx.bookId?.bookId})</span>
                    </td>
                    <td className="p-4 text-slate-600">{new Date(trx.issueDate).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-600">
                      {trx.status === 'Returned' 
                        ? new Date(trx.returnDate).toLocaleDateString()
                        : <span className="text-orange-500">{new Date(trx.dueDate).toLocaleDateString()} (Due)</span>
                      }
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
                      {trx.fine ? `$${trx.fine}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredTransactions.length > 0 && (
              <tfoot className="bg-slate-50 font-medium">
                <tr>
                  <td colSpan="6" className="p-4 text-right text-slate-700">Total Fine Collected:</td>
                  <td className="p-4 text-right text-slate-800">
                    ${filteredTransactions.reduce((acc, curr) => acc + (curr.fine || 0), 0)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
