import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TestimonialManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [formData, setFormData] = useState({ quote: '', name: '', occupation: '' });
    const [file, setFile] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // ... (fetchTestimonials logic remains the same)

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('quote', formData.quote);
        data.append('name', formData.name);
        data.append('occupation', formData.occupation);
        if (file) {
            data.append('image', file);
        }

        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/testimonials/${editingId}`, data);
            } else {
                await axios.post(`${API_URL}/api/testimonials`, data);
            }
            resetForm();
            fetchTestimonials();
        } catch (error) {
            console.error("Failed to submit testimonial", error);
        }
    };

    const handleEdit = (testimonial) => {
        setEditingId(testimonial._id);
        setFormData({
            quote: testimonial.quote,
            name: testimonial.name,
            occupation: testimonial.occupation,
        });
    };
    
    // ... (handleDelete logic remains the same)

    const resetForm = () => {
        setEditingId(null);
        setFormData({ quote: '', name: '', occupation: '' });
        setFile(null);
        document.getElementById('image-input').value = null; // Clear file input
    };

    return (
        <div className="p-8 font-sans bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Manage Testimonials</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                {/* ... other form inputs */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Author Image</label>
                    <input id="image-input" type="file" name="image" onChange={handleFileChange} className="mt-1 block w-full" />
                </div>
                {/* ... submit button */}
            </form>

            {/* ... list section */}
        </div>
    );
};

export default TestimonialManager;
