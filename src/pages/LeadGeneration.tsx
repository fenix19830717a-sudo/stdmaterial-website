import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LowThresholdLeadForm from '../components/LowThresholdLeadForm';
import MediumThresholdLeadForm from '../components/MediumThresholdLeadForm';
import HighThresholdLeadForm from '../components/HighThresholdLeadForm';
import FloatingContactButton from '../components/FloatingContactButton';

const LeadGeneration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('low');

  const tabs = [
    { id: 'low', title: 'Download Product Manual', description: 'Get our comprehensive product selection guide' },
    { id: 'medium', title: 'Generate Simulation Report', description: 'Customized report for your specific needs' },
    { id: 'high', title: 'Get Detailed Quote', description: 'Comprehensive quote tailored to your requirements' }
  ];

  return (
    <div className="bg-deep-navy text-slate-100 font-display selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-panel border-b border-white/5">
        <div className="bg-deep-navy/80 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">language</span>
                  <select id="language-select" className="bg-transparent text-slate-300 border-none text-xs focus:outline-none cursor-pointer">
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">payments</span>
                  <select id="currency-select" className="bg-transparent text-slate-300 border-none text-xs focus:outline-none cursor-pointer">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href="login.html" className="text-slate-300 hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">person</span>
                  <span>Login / Register</span>
                </a>
                <button id="chat-widget-btn" className="flex items-center gap-1 text-primary hover:text-accent transition-colors">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">chat</span>
                  <span>Live Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/20 border border-primary/50 rounded flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div>
                  <span className="material-symbols-outlined text-primary relative z-10" aria-hidden="true">precision_manufacturing</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">HUNAN SHENGTONGDA<span className="text-primary text-glow font-light ml-1">MATERIALS</span></span>
              </Link>
            </div>
            
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input type="text" id="global-search" placeholder="Search products, SKU, keywords..." 
                       className="w-full bg-surface-dark/50 border border-white/10 text-white rounded-lg py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" aria-hidden="true">search</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide">Home</Link>
              <div className="relative group">
                <a href="product-catalog.html" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide">
                  Products
                  <span className="material-symbols-outlined text-xs">expand_more</span>
                </a>
                <div className="absolute top-full left-0 w-full bg-surface-dark border border-white/5 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="px-6 py-8 grid grid-cols-3 gap-8">
                    <a href="product-catalog.html#grinding-equipment" className="flex flex-col items-center p-4 rounded-lg hover:bg-white/5 transition-colors group">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                        <span className="material-symbols-outlined text-2xl text-primary">construction</span>
                      </div>
                      <span className="text-white font-medium text-center">Grinding Equipment</span>
                      <span className="text-xs text-slate-400 mt-1 text-center">研磨设备</span>
                    </a>
                    <a href="product-catalog.html#grinding-media" className="flex flex-col items-center p-4 rounded-lg hover:bg-white/5 transition-colors group">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                        <span className="material-symbols-outlined text-2xl text-primary">sports_esports</span>
                      </div>
                      <span className="text-white font-medium text-center">Grinding Media</span>
                      <span className="text-xs text-slate-400 mt-1 text-center">研磨介质</span>
                    </a>
                    <a href="product-catalog.html#grinding-jars" className="flex flex-col items-center p-4 rounded-lg hover:bg-white/5 transition-colors group">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                        <span className="material-symbols-outlined text-2xl text-primary">inventory</span>
                      </div>
                      <span className="text-white font-medium text-center">Grinding Jars</span>
                      <span className="text-xs text-slate-400 mt-1 text-center">研磨罐</span>
                    </a>
                  </div>
                </div>
              </div>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide" href="simulator.html">Simulator</a>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide" href="selection.html">Industry Matcher</a>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide" href="news.html">News</a>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide" href="about.html">About</a>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide" href="contact.html">Contact</a>
              <Link to="/leads" className="text-sm font-medium text-primary hover:text-accent transition-colors tracking-wide">Get Information</Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden lg:flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-primary/30 text-primary rounded bg-primary/5 hover:bg-primary/10 transition-all uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">download</span> Catalog
              </button>
              <a href="contact.html" className="bg-primary text-deep-navy px-5 py-2 rounded font-bold hover:bg-accent hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase tracking-wide text-sm">
                Inquiry Now
              </a>
              <button className="md:hidden text-white" onClick={() => {}}>
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">menu</span>
              </button>
            </div>
          </div>
          <div className="mobile-menu hidden md:hidden pb-4">
            <div className="mb-4">
              <div className="relative">
                <input type="text" placeholder="Search products..." 
                       className="w-full bg-surface-dark/50 border border-white/10 text-white rounded-lg py-2 pl-10 pr-4 text-sm" />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">search</span>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide py-2">Home</Link>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide py-2" href="product-catalog.html">Products</a>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide py-2" href="simulator.html">Simulator</a>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide py-2" href="selection.html">Industry Matcher</a>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide py-2" href="news.html">News</a>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide py-2" href="about.html">About</a>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide py-2" href="contact.html">Contact</a>
              <Link to="/leads" className="text-sm font-medium text-primary hover:text-accent transition-colors tracking-wide py-2">Get Information</Link>
              <a className="text-sm font-medium text-slate-300 hover:text-primary transition-colors tracking-wide py-2" href="order-tracking.html">Track Order</a>
              <div className="flex gap-2 pt-2">
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-primary/30 text-primary rounded bg-primary/5 hover:bg-primary/10 transition-all uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">download</span> Catalog
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-primary text-deep-navy rounded hover:bg-accent transition-all uppercase tracking-wide">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">chat</span> Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 bg-deep-navy">
        <div className="absolute inset-0 blueprint-bg opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider-2 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Lead Generation
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
              Get the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-200 to-white text-glow">Right Information</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-3xl mx-auto font-light border-l-2 border-primary/30 pl-6">
              Choose the level of information you need, from basic product manuals to detailed quotes tailored to your specific requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-24 bg-surface-dark border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 md:flex-initial px-8 py-4 rounded-lg transition-all duration-300 ${activeTab === tab.id ? 'bg-primary text-deep-navy font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'glass-panel text-slate-300 hover:bg-white/5'}`}
              >
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-1">{tab.title}</h3>
                  <p className="text-xs text-slate-400">{tab.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-12">
            {activeTab === 'low' && <LowThresholdLeadForm />}
            {activeTab === 'medium' && <MediumThresholdLeadForm />}
            {activeTab === 'high' && <HighThresholdLeadForm />}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-deep-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-wider-2 mb-2 block">Why Choose Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Our Commitment</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
            <p className="text-slate-400 max-w-2xl mx-auto">We provide comprehensive support throughout your purchasing journey, from initial information to post-sales service.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">library_books</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Expert Knowledge</h3>
              <p className="text-slate-400">Our team of experts provides accurate and comprehensive information to help you make informed decisions.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">speed</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Fast Response</h3>
              <p className="text-slate-400">We strive to respond to your inquiries within 24 hours, ensuring you get the information you need quickly.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 text-primary">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">person_customizable</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Personalized Service</h3>
              <p className="text-slate-400">We tailor our responses to your specific needs, providing customized solutions for your unique applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dark py-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-surface border border-primary/50 rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">precision_manufacturing</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">HUNAN SHENGTONGDA<span className="text-primary font-light">MATERIALS</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-text-muted">
              <a className="hover:text-primary transition-colors" href="index.html">Home</a>
              <a className="hover:text-primary transition-colors" href="product-catalog.html">Products</a>
              <a className="hover:text-primary transition-colors" href="simulator.html">Simulator</a>
              <a className="hover:text-primary transition-colors" href="selection.html">Industry Matcher</a>
              <a className="hover:text-primary transition-colors" href="about.html">About Us</a>
              <a className="hover:text-primary transition-colors" href="contact.html">Contact</a>
            </div>
            <p className="text-xs text-text-muted font-mono">© 2026 Hunan Shengtongda Materials Technology Co., Ltd. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <a href="contact.html" className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
          <span className="material-symbols-outlined" aria-hidden="true">mail</span>
          Inquiry Now
        </a>
      </div>

      <FloatingContactButton />
    </div>
  );
};

export default LeadGeneration;