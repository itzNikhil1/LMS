import React, { useState, useEffect } from 'react';
import axios from '../api';
import { Plus, Edit2, Trash2, X, GraduationCap } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: '', name: '', email: '', phone: '', course: '', year: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        await axios.put(`/api/students/${editId}`, formData);
      } else {
        await axios.post('/api/students', formData);
      }
      fetchStudents();
      handleClear();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setEditId(student._id);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      year: student.year
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClear = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ studentId: '', name: '', email: '', phone: '', course: '', year: '' });
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Student Management</h2>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center">
          <GraduationCap className="mr-2 text-purple-600" size={20} />
          {isEditing ? 'Edit Student' : 'Add New Student'}
        </h3>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student ID*</label>
              <input type="text" name="studentId" value={formData.studentId} onChange={handleInputChange} required disabled={isEditing} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name*</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email*</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone*</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course*</label>
              <input type="text" name="course" value={formData.course} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year/Semester*</label>
              <input type="text" name="year" value={formData.year} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={handleClear} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center transition-colors">
              <X size={16} className="mr-1" /> Clear
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition-colors shadow-sm">
              {isEditing ? <Edit2 size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
              {isEditing ? 'Update Student' : 'Add Student'}
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
                <th className="p-4 font-semibold">Student ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Year</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">No students found. Add some!</td></tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{student.studentId}</td>
                    <td className="p-4 text-slate-800 font-medium">{student.name}</td>
                    <td className="p-4 text-slate-600">
                      <div>{student.email}</div>
                      <div className="text-xs text-slate-400 mt-1">{student.phone}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{student.course}</span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{student.year}</td>
                    <td className="p-4 flex justify-center space-x-2">
                      <button onClick={() => handleEdit(student)} className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(student._id)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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

export default Students;
