import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VolunteerManagement = () => {
  const [volunteerApplications, setVolunteerApplications] = useState([]);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [opportunityFormData, setOpportunityFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    duration: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: 'open'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [applicationsRes, opportunitiesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/volunteer-applications'),
        axios.get('http://localhost:5000/api/volunteer-opportunities')
      ]);
      setVolunteerApplications(applicationsRes.data);
      setVolunteerOpportunities(opportunitiesRes.data);
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpportunitySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOpportunity) {
        await axios.put(`http://localhost:5000/api/volunteer-opportunities/${editingOpportunity._id}`, opportunityFormData);
      } else {
        await axios.post('http://localhost:5000/api/volunteer-opportunities', opportunityFormData);
      }
      
      setShowOpportunityForm(false);
      setEditingOpportunity(null);
      resetOpportunityForm();
      fetchData();
    } catch (error) {
      console.error('Error saving opportunity:', error);
    }
  };

  const handleEditOpportunity = (opportunity) => {
    setEditingOpportunity(opportunity);
    setOpportunityFormData({
      title: opportunity.title || '',
      description: opportunity.description || '',
      requirements: opportunity.requirements || '',
      location: opportunity.location || '',
      duration: opportunity.duration || '',
      startDate: opportunity.startDate ? new Date(opportunity.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: opportunity.endDate ? new Date(opportunity.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: opportunity.status || 'open'
    });
    setShowOpportunityForm(true);
  };

  const handleDeleteOpportunity = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await axios.delete(`http://localhost:5000/api/volunteer-opportunities/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting opportunity:', error);
      }
    }
  };

  const resetOpportunityForm = () => {
    setOpportunityFormData({
      title: '',
      description: '',
      requirements: '',
      location: '',
      duration: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: 'open'
    });
  };

  const cancelOpportunityForm = () => {
    setShowOpportunityForm(false);
    setEditingOpportunity(null);
    resetOpportunityForm();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading volunteer data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
          <p className="text-gray-600">Manage volunteer applications and opportunities</p>
        </div>
        <button
          onClick={() => setShowOpportunityForm(true)}
          className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Add New Opportunity
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'applications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Applications ({volunteerApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'opportunities'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Opportunities ({volunteerOpportunities.length})
          </button>
        </nav>
      </div>

      {/* Volunteer Opportunity Form */}
      {showOpportunityForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
          </h2>
          <form onSubmit={handleOpportunitySubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={opportunityFormData.title}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter opportunity title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={opportunityFormData.status}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={opportunityFormData.description}
                onChange={(e) => setOpportunityFormData({ ...opportunityFormData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter opportunity description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  rows={3}
                  value={opportunityFormData.requirements}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, requirements: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter requirements"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={opportunityFormData.duration}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3 months, 6 hours/week"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={opportunityFormData.location}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={opportunityFormData.startDate}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={opportunityFormData.endDate}
                  onChange={(e) => setOpportunityFormData({ ...opportunityFormData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelOpportunityForm}
                className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {editingOpportunity ? 'Update Opportunity' : 'Create Opportunity'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Applications</h2>
          {volunteerApplications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <span className="text-4xl">📝</span>
              <p className="mt-2">No volunteer applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Interest Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteerApplications.map((application) => (
                    <tr key={application._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{application.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{application.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{application.phone || 'No phone'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{application.interestArea || 'Not specified'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{application.experience || 'No experience'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          New
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Opportunities</h2>
          {volunteerOpportunities.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <span className="text-4xl">🤝</span>
              <p className="mt-2">No volunteer opportunities found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteerOpportunities.map((opportunity) => (
                    <tr key={opportunity._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200 max-w-xs">
                        <div className="truncate" title={opportunity.title}>
                          {opportunity.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{opportunity.location || 'No location'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{opportunity.duration || 'Not specified'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{opportunity.startDate ? new Date(opportunity.startDate).toLocaleDateString() : 'No date'}</td>
                      <td>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(opportunity.status)}`}>
                          {opportunity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditOpportunity(opportunity)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOpportunity(opportunity._id)}
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
      )}
    </div>
  );
};

export default VolunteerManagement;
