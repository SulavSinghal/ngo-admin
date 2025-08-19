import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AboutUsManagement = () => {
  const [aboutUs, setAboutUs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mission: '',
    vision: '',
    values: '',
    imageUrl: '',
    contactInfo: {
      address: '',
      phone: '',
      email: '',
      website: ''
    }
  });

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/about-us');
      if (response.data && response.data.length > 0) {
        setAboutUs(response.data[0]);
        setFormData({
          title: response.data[0].title || '',
          description: response.data[0].description || '',
          mission: response.data[0].mission || '',
          vision: response.data[0].vision || '',
          values: response.data[0].values || '',
          imageUrl: response.data[0].imageUrl || '',
          contactInfo: {
            address: response.data[0].contactInfo?.address || '',
            phone: response.data[0].contactInfo?.phone || '',
            email: response.data[0].contactInfo?.email || '',
            website: response.data[0].contactInfo?.website || ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching about us:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (aboutUs) {
        await axios.put(`http://localhost:5000/api/about-us/${aboutUs._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/about-us', formData);
      }
      
      setShowForm(false);
      fetchAboutUs();
    } catch (error) {
      console.error('Error saving about us:', error);
    }
  };

  const handleEdit = () => {
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    if (aboutUs) {
      setFormData({
        title: aboutUs.title || '',
        description: aboutUs.description || '',
        mission: aboutUs.mission || '',
        vision: aboutUs.vision || '',
        values: aboutUs.values || '',
        imageUrl: aboutUs.imageUrl || '',
        contactInfo: {
          address: aboutUs.contactInfo?.address || '',
          phone: aboutUs.contactInfo?.phone || '',
          email: aboutUs.contactInfo?.email || '',
          website: aboutUs.contactInfo?.website || ''
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading about us content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Us Management</h1>
          <p className="text-gray-600">Manage your organization's about us content</p>
        </div>
        {!showForm && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {aboutUs ? 'Edit Content' : 'Add Content'}
          </button>
        )}
      </div>

      {/* About Us Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {aboutUs ? 'Edit About Us Content' : 'Add About Us Content'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter organization title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter organization description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mission
                </label>
                <textarea
                  rows={3}
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter organization mission"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vision
                </label>
                <textarea
                  rows={3}
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter organization vision"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Values
              </label>
              <textarea
                rows={3}
                value={formData.values}
                onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter organization values"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter main image URL"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, address: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter organization address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.contactInfo.website}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, website: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter website URL"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {aboutUs ? 'Update Content' : 'Create Content'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Content Display */}
      {!showForm && aboutUs && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current About Us Content</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{aboutUs.title}</h3>
              <p className="text-gray-600 mt-1">{aboutUs.description}</p>
            </div>
            
            {aboutUs.mission && (
              <div>
                <h4 className="font-medium text-gray-900">Mission</h4>
                <p className="text-gray-600 mt-1">{aboutUs.mission}</p>
              </div>
            )}
            
            {aboutUs.vision && (
              <div>
                <h4 className="font-medium text-gray-900">Vision</h4>
                <p className="text-gray-600 mt-1">{aboutUs.vision}</p>
              </div>
            )}
            
            {aboutUs.values && (
              <div>
                <h4 className="font-medium text-gray-900">Values</h4>
                <p className="text-gray-600 mt-1">{aboutUs.values}</p>
              </div>
            )}
            
            {aboutUs.contactInfo && (
              <div>
                <h4 className="font-medium text-gray-900">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {aboutUs.contactInfo.address && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Address:</span>
                      <p className="text-gray-600">{aboutUs.contactInfo.address}</p>
                    </div>
                  )}
                  {aboutUs.contactInfo.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Phone:</span>
                      <p className="text-gray-600">{aboutUs.contactInfo.phone}</p>
                    </div>
                  )}
                  {aboutUs.contactInfo.email && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{aboutUs.contactInfo.email}</p>
                    </div>
                  )}
                  {aboutUs.contactInfo.website && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Website:</span>
                      <p className="text-gray-600">{aboutUs.contactInfo.website}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!showForm && !aboutUs && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-center text-gray-500 py-8">
            <span className="text-4xl">ℹ️</span>
            <p className="mt-2">No about us content found</p>
            <p className="text-sm">Click "Add Content" to get started</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsManagement;
