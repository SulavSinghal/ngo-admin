import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  
  // --- 1. STATE UPDATED to match the Mongoose Model ---
  const [formData, setFormData] = useState({
    name: '',
    occupation: '',
    quote: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/testimonials');
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      // Append form data that matches the backend model
      data.append('name', formData.name);
      data.append('occupation', formData.occupation);
      data.append('quote', formData.quote);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingTestimonial) {
        await axios.put(`http://localhost:5000/api/testimonials/${editingTestimonial._id}`, data);
      } else {
        await axios.post('http://localhost:5000/api/testimonials', data);
      }
      
      setShowForm(false);
      setEditingTestimonial(null);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      // Log the detailed error from the backend for easier debugging
      console.error('Error saving testimonial:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    // --- 2. EDIT HANDLER UPDATED to use correct fields ---
    setFormData({
      name: testimonial.name || '',
      occupation: testimonial.occupation || '',
      quote: testimonial.quote || '',
    });
    setImageFile(null);
    // Note: The public URL doesn't need the host prefix here
    setImagePreview(testimonial.imageUrl ? `http://localhost:5000/${testimonial.imageUrl}` : '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await axios.delete(`http://localhost:5000/api/testimonials/${id}`);
        fetchTestimonials();
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const resetForm = () => {
    // --- 3. RESET FORM UPDATED ---
    setFormData({
      name: '',
      occupation: '',
      quote: '',
    });
    setImageFile(null);
    setImagePreview('');
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingTestimonial(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonial Management</h1>
          <p className="text-gray-600">Manage client and volunteer testimonials</p>
        </div>
        <button
          onClick={() => { setShowForm(true); resetForm(); setEditingTestimonial(null); }}
          className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Add New Testimonial
        </button>
      </div>

      {/* --- 4. FORM JSX UPDATED to match the model --- */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter person's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation *
                </label>
                <input
                  type="text"
                  required
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Volunteer, Program Beneficiary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quote *
              </label>
              <textarea
                required
                rows={4}
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter the testimonial quote"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image *</label>
              <input
                type="file"
                accept="image/*"
                // Make the file input not required when editing
                required={!editingTestimonial}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImageFile(file || null);
                  setImagePreview(file ? URL.createObjectURL(file) : '');
                }}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 h-24 w-24 object-cover rounded-full border"
                />
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={cancelForm} className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white">
                {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- 5. TESTIMONIALS TABLE UPDATED --- */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Testimonials</h2>
        {testimonials.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <span className="text-4xl">💬</span>
            <p className="mt-2">No testimonials found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quote</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial._id}>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <img src={`http://localhost:5000/${testimonial.imageUrl}`} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{testimonial.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{testimonial.occupation}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-200 max-w-sm">
                      <p className="truncate" title={testimonial.quote}>{testimonial.quote}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(testimonial)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(testimonial._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
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

export default TestimonialManagement;