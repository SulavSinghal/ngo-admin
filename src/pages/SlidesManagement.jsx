import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SlidesManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    headline: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    secondaryText: '',
    backgroundColor: '#1f326f',
    textColor: '#ffffff',
    order: 0,
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => { fetchSlides(); }, []);

  const fetchSlides = async () => {
    try {
      const res = await axios.get( `${API_URL}/api/slides`);
      setSlides(res.data);
    } catch (e) { console.error('Error fetching slides', e); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ headline: '', description: '', ctaText: '', ctaLink: '', secondaryText: '', backgroundColor: '#1f326f', textColor: '#ffffff', order: 0, active: true });
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append('image', imageFile);

      if (editing) {
        await axios.put(`${API_URL}/api/slides/${editing._id}`, data, { headers: { Authorization: localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : undefined } });
      } else {
        await axios.post(`${API_URL}/api/slides`, data, { headers: { Authorization: localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : undefined } });
      }
      setShowForm(false); setEditing(null); resetForm(); fetchSlides();
    } catch (e) { console.error('Error saving slide', e); }
  };

  const handleEdit = (slide) => {
    setEditing(slide);
    setFormData({
      headline: slide.headline || '', description: slide.description || '', ctaText: slide.ctaText || '', ctaLink: slide.ctaLink || '', secondaryText: slide.secondaryText || '', backgroundColor: slide.backgroundColor || '#1f326f', textColor: slide.textColor || '#ffffff', order: slide.order || 0, active: !!slide.active
    });
    setImagePreview(slide.image ? `${API_URL}${slide.image}` : '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete slide?')) return;
    try {
      await axios.delete(`${API_URL}/api/slides/${id}`, { headers: { Authorization: localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : undefined } });
      fetchSlides();
    } catch (e) { console.error('Error deleting slide', e); }
  };

  if (loading) return <div className="h-64 flex items-center justify-center text-gray-500">Loading slides...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Slides</h1>
          <p className="text-gray-600">Manage homepage hero slides</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700">Add Slide</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Edit Slide' : 'Add Slide'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <input value={formData.headline} onChange={e=>setFormData({ ...formData, headline: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={formData.description} onChange={e=>setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                <input value={formData.ctaText} onChange={e=>setFormData({ ...formData, ctaText: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                <input value={formData.ctaLink} onChange={e=>setFormData({ ...formData, ctaLink: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Text</label>
              <input value={formData.secondaryText} onChange={e=>setFormData({ ...formData, secondaryText: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                <input type="color" value={formData.backgroundColor} onChange={e=>setFormData({ ...formData, backgroundColor: e.target.value })} className="h-10 w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                <input type="color" value={formData.textColor} onChange={e=>setFormData({ ...formData, textColor: e.target.value })} className="h-10 w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input type="number" value={formData.order} onChange={e=>setFormData({ ...formData, order: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input id="active" type="checkbox" checked={formData.active} onChange={e=>setFormData({ ...formData, active: e.target.checked })} />
                <label htmlFor="active">Active</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
              <input type="file" accept="image/*" onChange={(e)=>{ const f=e.target.files?.[0]; setImageFile(f||null); setImagePreview(f? URL.createObjectURL(f):''); }} className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
              {imagePreview && (<img src={imagePreview} alt="Preview" className="mt-3 h-24 w-40 object-cover rounded border" />)}
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={()=>{ setShowForm(false); setEditing(null); resetForm(); }} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">{editing ? 'Update Slide' : 'Create Slide'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Slides</h2>
        {slides.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No slides found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Headline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map(s => (
                  <tr key={s._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{s.headline || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{s.order ?? 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">{s.active ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
                      <div className="flex gap-2">
                        <button onClick={()=>handleEdit(s)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                        <button onClick={()=>handleDelete(s._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
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

export default SlidesManagement;


