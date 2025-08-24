import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiSettings, FiSave, FiLoader } from 'react-icons/fi';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Main component for the entire admin panel
const ContactPage = () => {
  // State to manage which tab is currently active ('messages' or 'settings')
  const [activeTab, setActiveTab] = useState('messages');

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your website's messages and contact settings.</p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-300">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('messages')}
              className={`${
                activeTab === 'messages'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 flex items-center`}
            >
              <FiMessageSquare className="mr-2" /> Messages
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 flex items-center`}
            >
              <FiSettings className="mr-2" /> Contact Info Settings
            </button>
          </nav>
        </div>

        {/* Conditional rendering of tab content */}
        <main>
          {activeTab === 'messages' && <MessagesManager />}
          {activeTab === 'settings' && <ContactInfoManager />}
        </main>
      </div>
    </div>
  );
};


// Component to manage and display incoming messages
const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/messages`);

        // ✅ CORRECTED PART: Check if the response data is an array
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          // If the API gives us something else, log a warning and use an empty array
          console.warn("API response for messages was not an array:", res.data);
          setMessages([]); 
        }

      } catch (err) {
        console.error("Error fetching messages:", err);
        setError('Failed to load messages. You may not have the required permissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) return <div className="text-center p-10"><FiLoader className="animate-spin text-4xl text-teal-500 mx-auto" /></div>;
  if (error) return <div className="text-center p-10 text-red-500 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold text-gray-800">Inbox</h2>
        <p className="text-gray-500">Here are the messages submitted through your contact form.</p>
      </div>
      
      {messages.length === 0 ? (
        <p className="p-6 text-gray-500">No messages yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <ul className="divide-y divide-gray-200">
            {messages.map((msg) => (
              <li key={msg._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{msg.name}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(msg.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <p className="text-gray-600 mb-1">
                  <a href={`mailto:${msg.email}`} className="text-teal-600 hover:underline">{msg.email}</a>
                  {msg.phone && ` | ${msg.phone}`}
                </p>
                <p className="text-gray-800 font-semibold mb-2">Subject: {msg.subject}</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{msg.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


// Component to manage and update contact information
const ContactInfoManager = () => {
  const [formData, setFormData] = useState({
    location: '',
    email: '',
    phone: '',
    workingHours: { mondayFriday: '', saturday: '', sunday: '' },
    socialLinks: { facebook: '', twitter: '', instagram: '', youtube: '' },
  });
  const [status, setStatus] = useState({ message: '', type: '' }); // type can be 'success' or 'error'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get('/api/contact-info');
        // Ensure nested objects have default values if they don't exist
        setFormData({
            ...res.data,
            workingHours: res.data.workingHours || { mondayFriday: '', saturday: '', sunday: '' },
            socialLinks: res.data.socialLinks || { facebook: '', twitter: '', instagram: '', youtube: '' }
        });
      } catch (err) {
        console.error("Error fetching contact info:", err);
        setStatus({ message: 'Could not load existing settings.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.'); // e.g., 'workingHours.mondayFriday'

    if (keys.length > 1) {
      // Handle nested state update
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      // Handle top-level state update
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

 // Inside the ContactInfoManager component...

const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus({ message: 'Saving...', type: 'loading' });
  try {
    // 1. Capture the response from the server
    const res = await axios.put(`${API_URL}/api/contact-info`, formData);

    // 2. Update the local state with the fresh data from the response
    setFormData(res.data); 

    setStatus({ message: 'Settings updated successfully!', type: 'success' });
  } catch (err) {
    console.error("Error updating contact info:", err);
    setStatus({ message: 'Failed to update settings. Please try again.', type: 'error' });
  }
   setTimeout(() => setStatus({ message: '', type: '' }), 4000);
};

  if (loading) return <div className="text-center p-10"><FiLoader className="animate-spin text-4xl text-teal-500 mx-auto" /></div>;

  const inputStyles = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500";
  const labelStyles = "block text-gray-700 text-sm font-semibold mb-1";
  const sectionStyles = "grid grid-cols-1 md:grid-cols-2 gap-6";

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold text-gray-800">Update Contact Information</h2>
        <p className="text-gray-500">Edit the details that appear on your public contact page.</p>
      </div>
      <div className="p-6 space-y-8">
        {/* Basic Info */}
        <div className={sectionStyles}>
          <div><label className={labelStyles}>Location</label><input type="text" name="location" value={formData.location} onChange={handleChange} className={inputStyles} /></div>
          <div><label className={labelStyles}>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyles} /></div>
          <div><label className={labelStyles}>Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputStyles} /></div>
        </div>

        {/* Working Hours */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Working Hours</h3>
          <div className={sectionStyles}>
            <div><label className={labelStyles}>Monday - Friday</label><input type="text" name="workingHours.mondayFriday" value={formData.workingHours.mondayFriday} onChange={handleChange} className={inputStyles} /></div>
            <div><label className={labelStyles}>Saturday</label><input type="text" name="workingHours.saturday" value={formData.workingHours.saturday} onChange={handleChange} className={inputStyles} /></div>
            <div><label className={labelStyles}>Sunday</label><input type="text" name="workingHours.sunday" value={formData.workingHours.sunday} onChange={handleChange} className={inputStyles} /></div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Social Media Links</h3>
          <div className={sectionStyles}>
            <div><label className={labelStyles}>Facebook URL</label><input type="url" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange} className={inputStyles} /></div>
            <div><label className={labelStyles}>Twitter URL</label><input type="url" name="socialLinks.twitter" value={formData.socialLinks.twitter} className={inputStyles} /></div>
            <div><label className={labelStyles}>Instagram URL</label><input type="url" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange} className={inputStyles} /></div>
            <div><label className={labelStyles}>YouTube URL</label><input type="url" name="socialLinks.youtube" value={formData.socialLinks.youtube} onChange={handleChange} className={inputStyles} /></div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-6 flex items-center justify-between rounded-b-lg">
        <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-6 rounded-md hover:bg-teal-700 transition duration-300 flex items-center">
          <FiSave className="mr-2" /> Save Changes
        </button>
        {status.message && (
          <p className={`font-semibold ${
            status.type === 'success' ? 'text-green-600' :
            status.type === 'error' ? 'text-red-600' : 'text-gray-600'
          }`}>{status.message}</p>
        )}
      </div>
    </form>
  );
};

export default ContactPage;