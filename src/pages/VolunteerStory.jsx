import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VolunteerStoryManagement = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  
  // State to hold form data, matching the VolunteerStoryModel
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    quote: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // API endpoint for volunteer stories
  const API_URL = 'http://localhost:5000/api/volunteer-stories';

  useEffect(() => {
    fetchStories();
  }, []);

  // --- DATA FETCHING ---
  const fetchStories = async () => {
    try {
      const response = await axios.get(API_URL);
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching volunteer stories:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- FORM HANDLING ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use FormData to handle file uploads
    const data = new FormData();
    data.append('name', formData.name);
    data.append('role', formData.role);
    data.append('quote', formData.quote);
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingStory) {
        // Update existing story
        await axios.put(`${API_URL}/${editingStory._id}`, data);
      } else {
        // Create new story
        await axios.post(API_URL, data);
      }
      
      // Reset UI and fetch updated data
      setShowForm(false);
      setEditingStory(null);
      resetForm();
      fetchStories();
    } catch (error) {
      console.error('Error saving story:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      name: story.name || '',
      role: story.role || '',
      quote: story.quote || '',
    });
    // Construct full URL for image preview
    setImagePreview(story.imageUrl ? `http://localhost:5000/${story.imageUrl.replace(/\\/g, "/")}` : '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchStories(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', quote: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingStory(null);
    resetForm();
  };

  // --- STYLES ---
  const inputStyle = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading stories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Story Management</h1>
          <p className="text-gray-600">Share the inspiring stories of your volunteers</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingStory(null); resetForm(); }}
          className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Story
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{editingStory ? 'Edit Story' : 'Add New Story'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Volunteer Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputStyle} placeholder="e.g., Aarti D." />
              </div>
              <div>
                <label className={labelStyle}>Role / Title *</label>
                <input type="text" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={inputStyle} placeholder="e.g., Volunteer since 2022" />
              </div>
            </div>
            <div>
              <label className={labelStyle}>Story / Quote *</label>
              <textarea required rows={5} value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} className={inputStyle} placeholder="Share their experience..."></textarea>
            </div>
            <div>
              <label className={labelStyle}>Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImageFile(file || null);
                  setImagePreview(file ? URL.createObjectURL(file) : '');
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-4 h-24 w-24 object-cover rounded-full border-2 border-gray-200" />
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" onClick={cancelForm} className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700">{editingStory ? 'Update Story' : 'Create Story'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Stories Table */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Volunteer Stories</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Quote</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stories.map((story) => (
                <tr key={story._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {story.imageUrl ? (
                      <img src={`http://localhost:5000/${story.imageUrl.replace(/\\/g, "/")}`} alt={story.name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Img</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{story.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{story.role}</td>
                  <td className="px-6 py-4 text-gray-700 max-w-sm">
                    <p className="truncate" title={story.quote}>{story.quote}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <button onClick={() => handleEdit(story)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                      <button onClick={() => handleDelete(story._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerStoryManagement;
