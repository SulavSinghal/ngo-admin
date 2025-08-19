import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VolunteerManagement = () => {
  const [volunteerApplications, setVolunteerApplications] = useState([]);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [activeTab, setActiveTab] = useState('applications');
  const [loading, setLoading] = useState(true);
  const [showOpportunityForm, setShowOpportunityForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  // --- CORRECTED STATE that matches the Mongoose Model ---
  const [opportunityFormData, setOpportunityFormData] = useState({
    title: '',
    description: '',
    category: '',
    badge: '',
    time: '',
    hoursPerWeek: '',
    icon: '',
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

  // --- CORRECTED EDIT HANDLER that matches the initial state ---
  const handleEditOpportunity = (opportunity) => {
    setEditingOpportunity(opportunity);
    setOpportunityFormData({
      title: opportunity.title || '',
      description: opportunity.description || '',
      category: opportunity.category || '',
      badge: opportunity.badge || '',
      time: opportunity.time || '',
      hoursPerWeek: opportunity.hoursPerWeek || '',
      icon: opportunity.icon || '',
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
      category: '',
      badge: '',
      time: '',
      hoursPerWeek: '',
      icon: '',
    });
  };

  const cancelOpportunityForm = () => {
    setShowOpportunityForm(false);
    setEditingOpportunity(null);
    resetOpportunityForm();
  };

  // --- Common Styles for Reusability ---
  const inputStyle = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading volunteer data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
          <p className="text-gray-600">Manage volunteer applications and opportunities</p>
        </div>
        <button
          onClick={() => { setShowOpportunityForm(true); setEditingOpportunity(null); resetOpportunityForm(); }}
          className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Add New Opportunity
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'applications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Applications ({volunteerApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'opportunities' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Opportunities ({volunteerOpportunities.length})
          </button>
        </nav>
      </div>

      {showOpportunityForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}</h2>
          <form onSubmit={handleOpportunitySubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Title *</label>
                <input type="text" required value={opportunityFormData.title} onChange={(e) => setOpportunityFormData({ ...opportunityFormData, title: e.target.value })} className={inputStyle} placeholder="e.g., Event Staff" />
              </div>
              <div>
                <label className={labelStyle}>Category</label>
                <input type="text" value={opportunityFormData.category} onChange={(e) => setOpportunityFormData({ ...opportunityFormData, category: e.target.value })} className={inputStyle} placeholder="e.g., Community Outreach" />
              </div>
            </div>
            <div>
              <label className={labelStyle}>Description *</label>
              <textarea required rows={4} value={opportunityFormData.description} onChange={(e) => setOpportunityFormData({ ...opportunityFormData, description: e.target.value })} className={inputStyle} placeholder="Describe the role..."></textarea>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className={labelStyle}>Badge</label>
                <input type="text" value={opportunityFormData.badge} onChange={(e) => setOpportunityFormData({ ...opportunityFormData, badge: e.target.value })} className={inputStyle} placeholder="e.g., Remote, Weekends" />
              </div>
              <div>
                <label className={labelStyle}>Time Commitment</label>
                <input type="text" value={opportunityFormData.time} onChange={(e) => setOpportunityFormData({ ...opportunityFormData, time: e.target.value })} className={inputStyle} placeholder="e.g., Mornings" />
              </div>
              <div>
                <label className={labelStyle}>Hours Per Week</label>
                <input type="text" value={opportunityFormData.hoursPerWeek} onChange={(e) => setOpportunityFormData({ ...opportunityFormData, hoursPerWeek: e.target.value })} className={inputStyle} placeholder="e.g., 5-10 hours" />
              </div>
            </div>
             <div>
                <label className={labelStyle}>Icon URL (Optional)</label>
                <input type="text" value={opportunityFormData.icon} onChange={(e) => setOpportunityFormData({ ...opportunityFormData, icon: e.target.value })} className={inputStyle} placeholder="https://.../icon.png" />
              </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={cancelOpportunityForm} className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">{editingOpportunity ? 'Update Opportunity' : 'Create Opportunity'}</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'applications' && (
         <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Applications</h2>
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Area of Interest</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {volunteerApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{app.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{app.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{app.phone || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{app.areaOfInterest || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{app.availability?.join(', ') || 'N/A'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
         </div>
      )}

      {activeTab === 'opportunities' && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Opportunities</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Hours/Week</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {volunteerOpportunities.map((op) => (
                  <tr key={op._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{op.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{op.category || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{op.badge || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{op.time || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{op.hoursPerWeek || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => handleEditOpportunity(op)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                        <button onClick={() => handleDeleteOpportunity(op._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerManagement;
