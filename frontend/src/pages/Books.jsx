import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bookId: '', title: '', author: '', category: '', publisher: '', year: '', quantity: 1
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/books');
      setBooks(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5001/api/books/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5001/api/books', formData);
      }
      fetchBooks();
      handleClear();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (book) => {
    setIsEditing(true);
    setEditId(book._id);
    setFormData({
      bookId: book.bookId,
      title: book.title,
      author: book.author,
      category: book.category,
      publisher: book.publisher || '',
      year: book.year || '',
      quantity: book.quantity
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5001/api/books/${id}`);
        fetchBooks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClear = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ bookId: '', title: '', author: '', category: '', publisher: '', year: '', quantity: 1 });
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Book Management</h2>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
          {isEditing ? 'Edit Book' : 'Add New Book'}
        </h3>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Book ID*</label>
              <input type="text" name="bookId" value={formData.bookId} onChange={handleInputChange} required disabled={isEditing} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title*</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Author*</label>
              <input type="text" name="author" value={formData.author} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category*</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity*</label>
              <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Publisher</label>
              <input type="text" name="publisher" value={formData.publisher} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={handleClear} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center transition-colors">
              <X size={16} className="mr-1" /> Clear
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition-colors shadow-sm">
              {isEditing ? <Edit2 size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
              {isEditing ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Book ID</th>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Author</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold text-center">Qty</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-500">No books found. Add some!</td></tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{book.bookId}</td>
                    <td className="p-4 text-slate-700">{book.title}</td>
                    <td className="p-4 text-slate-600">{book.author}</td>
                    <td className="p-4 text-slate-600">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{book.category}</span>
                    </td>
                    <td className="p-4 text-center text-slate-700 font-medium">{book.quantity}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${book.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center space-x-2">
                      <button onClick={() => handleEdit(book)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(book._id)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
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

export default Books;
