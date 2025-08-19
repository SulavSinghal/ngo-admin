import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BlogManagement from './pages/BlogManagement';
import ActivityManagement from './pages/ActivityManagement';
import TeamManagement from './pages/TeamManagement';
import VolunteerManagement from './pages/VolunteerManagement';
import AboutUsManagement from './pages/AboutUsManagement';
import TestimonialManagement from './pages/TestimonialManagement';
import InchargeManagement from './pages/InchargeManagement';
import SlidesManagement from './pages/SlidesManagement';
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="activities" element={<ActivityManagement />} />
            <Route path="team" element={<TeamManagement />} />
            <Route path="slides" element={<SlidesManagement />} />
            <Route path="volunteers" element={<VolunteerManagement />} />
            <Route path="incharges" element={<InchargeManagement />} />
            <Route path="about-us" element={<AboutUsManagement />} />
            <Route path="testimonials" element={<TestimonialManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
