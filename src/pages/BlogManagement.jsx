import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// A helper function to format dates for the input field
const formatDateForInput = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  return new Date(dateString).toISOString().split('T')[0];
};

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: formatDateForInput(),
    location: '',
    details: '',
    existingImageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataPayload = new FormData();
    dataPayload.append('title', formData.title);
    dataPayload.append('description', formData.description);
    dataPayload.append('category', formData.category);
    dataPayload.append('date', formData.date);
    dataPayload.append('location', formData.location);
    dataPayload.append('details', formData.details);
    
    if (imageFile) {
      dataPayload.append('image', imageFile);
    } else if (formData.existingImageUrl) {
      dataPayload.append('imageUrl', formData.existingImageUrl);
    }

    try {
      if (editingBlog) {
        await axios.put(`${API_URL}/api/blogs/${editingBlog._id}`, dataPayload);
      } else {
        await axios.post(`${API_URL}/api/blogs`, dataPayload);
      }
      
      cancelForm();
      fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      description: blog.description || '',
      category: blog.category || '',
      date: formatDateForInput(blog.date),
      location: blog.location || '',
      details: blog.details || '',
      existingImageUrl: blog.imageUrl || '',
    });
    setImageFile(null);
    setImagePreview(blog.imageUrl ? `${API_URL}${blog.imageUrl}` : '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`${API_URL}/api/blogs/${id}`);
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      date: formatDateForInput(),
      location: '',
      details: '',
      existingImageUrl: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingBlog(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* ... (Header and Add New Button JSX is the same) ... */}
         <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Manage your blog posts and articles</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Add New Blog Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          {/* ... (The entire <form> JSX is the same) ... */}
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter blog title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Education, Social Welfare" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="A short summary for the blog card" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Content (Details)</label>
              <textarea rows={6} value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter the full blog content here" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., New Delhi, India" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; setImageFile(file || null); setImagePreview(file ? URL.createObjectURL(file) : ''); }} className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
              {(imagePreview || formData.existingImageUrl) && (
                <img src={imagePreview || `${API_URL}${formData.existingImageUrl}`} alt="Preview" className="mt-3 h-32 w-32 object-cover rounded border" />
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={cancelForm} className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">{editingBlog ? 'Update Blog' : 'Create Blog'}</button>
            </div>
          </form>
        </div>
      )}

      {/* ========= THIS IS THE RESTORED SECTION ========= */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Blog Posts</h2>
        {blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="mt-2">No blog posts found. Click "Add New Blog Post" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200 max-w-xs">
                      <div className="truncate" title={blog.title}>
                        {blog.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{blog.category || 'Uncategorized'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{blog.date ? new Date(blog.date).toLocaleDateString() : 'No date'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;