import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">{children}</div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    blog: 0,
    activities: 0,
    teamMembers: 0,
    volunteers: 0,
    testimonials: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogRes, activitiesRes, teamRes, volunteersRes, testimonialsRes] = await Promise.all([
        axios.get( `${API_URL}/api/blog`),
        axios.get(`${API_URL}/api/activities`),
        axios.get(`${API_URL}/api/teamMembers`),
        axios.get(`${API_URL}/api/volunteer-applications`),
        axios.get(`${API_URL}/api/testimonials`)
      ]);

      setStats({
        blog: blogRes.data.length,
        activities: activitiesRes.data.length,
        teamMembers: teamRes.data.length,
        volunteers: volunteersRes.data.length,
        testimonials: testimonialsRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Add Blog Post', description: 'Create a new blog post', href: '/blog', icon: '📝', color: 'bg-blue-500' },
    { title: 'Add Activity', description: 'Create a new activity', href: '/activities', icon: '🎯', color: 'bg-green-500' },
    { title: 'Add Team Member', description: 'Add a new team member', href: '/team', icon: '👥', color: 'bg-purple-500' },
    { title: 'View Volunteers', description: 'Manage volunteer applications', href: '/volunteers', icon: '🤝', color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your NGO content management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blog Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.blog}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activities}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.teamMembers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">🤝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Volunteers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.volunteers}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Testimonials</p>
              <p className="text-2xl font-bold text-gray-900">{stats.testimonials}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-2xl text-white">{action.icon}</span>
                </div>
                <h3 className="font-medium text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card>
          <div className="text-center text-gray-500 py-8">
            <span className="text-4xl">📊</span>
            <p className="mt-2">Activity tracking coming soon...</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
