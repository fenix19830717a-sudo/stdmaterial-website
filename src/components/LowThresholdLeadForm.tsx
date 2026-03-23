import React, { useState } from 'react';
import axios from 'axios';

const LowThresholdLeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/leads/low', formData);
      setMessage(response.data.message);
      setFormData({ name: '', email: '', company: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl border border-white/10">
      <h3 className="text-2xl font-bold mb-6 text-white">Download Product Selection Manual</h3>
      <p className="text-slate-400 mb-6">Get our comprehensive product selection guide to help you choose the right grinding equipment for your needs.</p>
      
      {message && (
        <div className="mb-6 p-4 bg-success/20 border border-success/30 rounded-lg text-success">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-destructive/20 border border-destructive/30 rounded-lg text-destructive">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
            placeholder="Enter your email address"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Company (Optional)</label>
          <input 
            type="text" 
            name="company" 
            value={formData.company}
            onChange={handleChange}
            className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
            placeholder="Enter your company name"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase tracking-wide"
        >
          {isSubmitting ? 'Processing...' : 'Download Manual'}
        </button>
      </form>
    </div>
  );
};

export default LowThresholdLeadForm;