import React, { useState } from 'react';
import axios from 'axios';

const HighThresholdLeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    industry: '',
    application: '',
    productModel: '',
    quantity: 1,
    specifications: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('/api/leads/high', formData);
      setMessage(response.data.message);
      setFormData({ name: '', email: '', company: '', phone: '', industry: '', application: '', productModel: '', quantity: 1, specifications: '', budget: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl border border-white/10">
      <h3 className="text-2xl font-bold mb-6 text-white">Get Detailed Quote</h3>
      <p className="text-slate-400 mb-6">Our sales team will provide you with a comprehensive quote tailored to your specific requirements.</p>
      
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
        <div className="grid md:grid-cols-2 gap-6">
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
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Company</label>
            <input 
              type="text" 
              name="company" 
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
              placeholder="Enter your company name"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Industry</label>
          <select 
            name="industry" 
            value={formData.industry}
            onChange={handleChange}
            required
            className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary p-3"
          >
            <option value="">Select your industry</option>
            <option value="mining">Mining & Minerals</option>
            <option value="pharmaceutical">Pharmaceutical</option>
            <option value="ceramic">Ceramic & Glass</option>
            <option value="chemical">Chemical Industry</option>
            <option value="materials">Materials Science</option>
            <option value="academic">Academic Research</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Application</label>
          <input 
            type="text" 
            name="application" 
            value={formData.application}
            onChange={handleChange}
            required
            className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
            placeholder="Describe your specific application"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Product Model</label>
          <input 
            type="text" 
            name="productModel" 
            value={formData.productModel}
            onChange={handleChange}
            required
            className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
            placeholder="Enter the product model you're interested in"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Quantity</label>
            <input 
              type="number" 
              name="quantity" 
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
              placeholder="Enter quantity"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Budget Range (Optional)</label>
            <input 
              type="text" 
              name="budget" 
              value={formData.budget}
              onChange={handleChange}
              className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
              placeholder="Enter your budget range"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Additional Specifications</label>
          <textarea 
            name="specifications" 
            value={formData.specifications}
            onChange={handleChange}
            rows={4}
            className="w-full bg-deep-navy border border-slate-700 text-white rounded focus:ring-primary focus:border-primary placeholder-slate-600 p-3"
            placeholder="Enter any additional specifications or requirements"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase tracking-wide"
        >
          {isSubmitting ? 'Processing...' : 'Get Quote'}
        </button>
      </form>
    </div>
  );
};

export default HighThresholdLeadForm;