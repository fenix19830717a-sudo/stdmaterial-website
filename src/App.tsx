import './App.css'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import LeadGeneration from './pages/LeadGeneration'
import FloatingContactButton from './components/FloatingContactButton'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="bg-deep-navy text-slate-100 font-display selection:bg-primary selection:text-white">
      {!isAdminRoute && (
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
                      <span className="text-white font-medium text-center">研磨设备</span>
                      <span className="text-xs text-slate-400 mt-1 text-center">Grinding Equipment</span>
                    </a>
                    <a href="product-catalog.html#grinding-media" className="flex flex-col items-center p-4 rounded-lg hover:bg-white/5 transition-colors group">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                        <span className="material-symbols-outlined text-2xl text-primary">sports_esports</span>
                      </div>
                      <span className="text-white font-medium text-center">研磨介质</span>
                      <span className="text-xs text-slate-400 mt-1 text-center">Grinding Media</span>
                    </a>
                    <a href="product-catalog.html#grinding-jars" className="flex flex-col items-center p-4 rounded-lg hover:bg-white/5 transition-colors group">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                        <span className="material-symbols-outlined text-2xl text-primary">inventory</span>
                      </div>
                      <span className="text-white font-medium text-center">研磨罐</span>
                      <span className="text-xs text-slate-400 mt-1 text-center">Grinding Jars</span>
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
      )}
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/leads" element={<LeadGeneration />} />
        <Route path="/" element={
        <>
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 bg-deep-navy">
        <div className="absolute inset-0 blueprint-bg opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 py-1 px-3 rounded border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider-2 mb-8 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Next-Gen Material Processing
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                Precision Milling <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-200 to-white text-glow">Redefined</span>
              </h1>
              <p className="text-lg text-slate-400 mb-10 max-w-xl font-light border-l-2 border-primary/30 pl-6">
                Industry-leading planetary ball mills for nano-scale material processing. Achieve unmatched precision, consistency, and efficiency with our advanced milling technology.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="product-catalog.html" className="group bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded font-bold text-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 uppercase tracking-wide">
                  Explore Systems <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
                </a>
                <a href="contact.html" className="glass-panel text-white px-8 py-4 rounded font-bold text-lg hover:bg-white/10 transition-colors uppercase tracking-wide flex items-center gap-2">
                  Get Quote <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" aria-hidden="true">send</span>
                </a>
              </div>
              <div className="mt-12 flex items-center gap-8 text-slate-500 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-primary">01</span> / ISO 9001 Certified
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">02</span> / Nano-Scale Processing
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">03</span> / 24/7 Reliable Operation
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="absolute -top-10 -right-10 text-primary/10 font-black text-9xl select-none z-0">PM-400</div>
              <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm">
                <img alt="High Tech Planetary Ball Mill Render" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk-drzsS_rhtYaiIP0kUiKECsukgoC_tlMrH8puiRAJ-2cXWF6fDsIvBaRxhGXz16JFjYy6ad-9c-Kw5juSKXRNj0b_Cg_U1f1i27OA4wcV-vUF9ccLXitArVE9UYQ_6VO9Fvao5JEcm-L0J-C01iw6-4cQDfLbeSk8LLkrH_QDk9HdfgGNogUhPukS_NT8oHF94B9L6tim59cIWOYIv3x8nWGVl9phH03qEPPofdITLD-oC41zpr-MDQo5P-tiGO6BT86B1lOUWs" loading="lazy" />
                <div className="absolute bottom-6 right-6 glass-panel p-4 rounded border-l-4 border-primary max-w-xs transform translate-y-2 opacity-90">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-primary">STATUS: ACTIVE</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-white font-bold text-lg leading-none">High-Energy</p>
                      <p className="text-slate-400 text-xs mt-1">Planetary Ball Mill PM-4</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 -right-12 w-24 h-[1px] bg-primary/30 hidden lg:block"></div>
              <div className="absolute top-1/2 -right-16 w-2 h-2 bg-primary rounded-full hidden lg:block"></div>
              <div className="absolute top-1/2 -right-16 text-xs text-primary font-mono ml-4 mt-negative-2 hidden lg:block">ROTOR_SPEED: 800RPM</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-dark border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-bold uppercase tracking-wider-2 mb-2 block">Trusted By</span>
            <h2 className="text-3xl font-bold mb-4 text-white">Industry Recognition</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Certifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-lg flex items-center justify-center h-20">
                  <span className="text-2xl font-bold text-primary">ISO 9001</span>
                </div>
                <div className="glass-panel p-4 rounded-lg flex items-center justify-center h-20">
                  <span className="text-2xl font-bold text-primary">CE</span>
                </div>
                <div className="glass-panel p-4 rounded-lg flex items-center justify-center h-20">
                  <span className="text-2xl font-bold text-primary">ROHS</span>
                </div>
                <div className="glass-panel p-4 rounded-lg flex items-center justify-center h-20">
                  <span className="text-2xl font-bold text-primary">ISO 14001</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Partner Companies</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-lg flex items-center justify-center h-20">
                  <span className="text-xl font-bold text-slate-300">Siemens</span>
                </div>
                <div className="glass-panel p-4 rounded-lg flex items-center justify-center h-20">
                  <span className="text-xl font-bold text-slate-300">BASF</span>
                </div>
                <div className="glass-panel p-4 rounded-lg flex items-center justify-center h-20">
                  <span className="text-xl font-bold text-slate-300">Dow</span>
                </div>
                <div className="glass-panel p-4 rounded-lg flex items-center justify-center h-20">
                  <span className="text-xl font-bold text-slate-300">Samsung</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">25+</div>
                  <div className="text-sm text-slate-400">Years Experience</div>
                </div>
                <div className="glass-panel p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">12k+</div>
                  <div className="text-sm text-slate-400">Global Customers</div>
                </div>
                <div className="glass-panel p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-slate-400">Countries Served</div>
                </div>
                <div className="glass-panel p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-slate-400">Product Models</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-24 bg-surface-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-wider-2 mb-2 block">Our Solutions</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Industrial Grinding Equipment</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
            <p className="text-slate-400 max-w-2xl mx-auto">Advanced milling solutions for every application. From laboratory research to industrial production, we have the perfect system for your needs.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-primary border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">settings_motion_mode</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">Planetary Ball Mill</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">High-energy milling with 4 stations. Perfect for nano-scale material processing and mechanical alloying.</p>
                <div className="mt-auto">
                  <a href="product-catalog.html?category=planetary" className="block w-full py-3 bg-primary/10 border border-primary/30 text-primary rounded-lg font-bold hover:bg-primary/20 transition-colors group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-center">
                    View Products
                  </a>
                </div>
              </div>
            </div>
            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-secondary border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">rotate_right</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-secondary transition-colors">Roller Ball Mill</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">Continuous production with large capacity. Ideal for industrial-scale material processing and blending.</p>
                <div className="mt-auto">
                  <a href="product-catalog.html?category=roller" className="block w-full py-3 bg-secondary/10 border border-secondary/30 text-secondary rounded-lg font-bold hover:bg-secondary/20 transition-colors group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] text-center">
                    View Products
                  </a>
                </div>
              </div>
            </div>
            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-success/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-success border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">blender</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-success transition-colors">Stirred Ball Mill</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">High-efficiency wet grinding. Perfect for paints, inks, and other slurry-based applications.</p>
                <div className="mt-auto">
                  <a href="product-catalog.html?category=stirred" className="block w-full py-3 bg-success/10 border border-success/30 text-success rounded-lg font-bold hover:bg-success/20 transition-colors group-hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] text-center">
                    View Products
                  </a>
                </div>
              </div>
            </div>
            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-primary border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">inventory</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">Grinding Media</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">High-purity grinding jars and balls in various materials. Minimal contamination for precise results.</p>
                <div className="mt-auto">
                  <a href="product-catalog.html?category=media" className="block w-full py-3 bg-primary/10 border border-primary/30 text-primary rounded-lg font-bold hover:bg-primary/20 transition-colors group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] text-center">
                    View Products
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="applications" className="py-24 bg-deep-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-wider-2 mb-2 block">Industry Solutions</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Browse by Application</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
            <p className="text-slate-400 max-w-2xl mx-auto">Our grinding solutions serve a wide range of industries, from cutting-edge research to industrial production. Browse by application to find the perfect solution for your needs.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">minimize</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Mining & Minerals</h3>
              <p className="text-sm text-slate-400 mb-4">Ore sample preparation and geological analysis with high precision and minimal contamination.</p>
              <a href="product-catalog.html?category=Roller Mills" className="flex items-center text-xs text-primary hover:text-accent transition-colors">
                <span>View Solutions</span>
                <span className="material-symbols-outlined ml-1 text-xs" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
            <div className="glass-panel p-6 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">medical_information</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Pharmaceutical</h3>
              <p className="text-sm text-slate-400 mb-4">API manufacturing and nano-drug delivery systems meeting strict purity requirements.</p>
              <a href="product-catalog.html?category=Planetary Ball Mills" className="flex items-center text-xs text-primary hover:text-accent transition-colors">
                <span>View Solutions</span>
                <span className="material-symbols-outlined ml-1 text-xs" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
            <div className="glass-panel p-6 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">science</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Ceramics & Glass</h3>
              <p className="text-sm text-slate-400 mb-4">Ceramic powder synthesis and glaze preparation with consistent particle size distribution.</p>
              <a href="product-catalog.html?category=Planetary Ball Mills" className="flex items-center text-xs text-primary hover:text-accent transition-colors">
                <span>View Solutions</span>
                <span className="material-symbols-outlined ml-1 text-xs" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
            <div className="glass-panel p-6 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">science</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Chemical Industry</h3>
              <p className="text-sm text-slate-400 mb-4">Mechanochemical synthesis and catalyst preparation with high efficiency and repeatability.</p>
              <a href="product-catalog.html?category=Stirring Mills" className="flex items-center text-xs text-primary hover:text-accent transition-colors">
                <span>View Solutions</span>
                <span className="material-symbols-outlined ml-1 text-xs" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
            <div className="glass-panel p-6 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">layers</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Materials Science</h3>
              <p className="text-sm text-slate-400 mb-4">Nanomaterial and composite research with precise control of particle size and morphology.</p>
              <a href="product-catalog.html?category=Planetary Ball Mills" className="flex items-center text-xs text-primary hover:text-accent transition-colors">
                <span>View Solutions</span>
                <span className="material-symbols-outlined ml-1 text-xs" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
            <div className="glass-panel p-6 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <span className="material-symbols-outlined text-xl" aria-hidden="true">school</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Academic Research</h3>
              <p className="text-sm text-slate-400 mb-4">Laboratory research and publication with reliable, reproducible results and scientific excellence.</p>
              <a href="product-catalog.html?category=Planetary Ball Mills" className="flex items-center text-xs text-primary hover:text-accent transition-colors">
                <span>View Solutions</span>
                <span className="material-symbols-outlined ml-1 text-xs" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-dark border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-panel p-8 rounded-2xl tech-border group">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">electric_bolt</span>
                <h4 className="font-bold text-lg mb-2 text-white">Energy Efficiency</h4>
                <p className="text-sm text-slate-400">95% energy efficiency compared to traditional ball mills.</p>
                <div className="mt-4 text-3xl font-bold text-primary">95%</div>
              </div>
              <div className="glass-panel p-8 rounded-2xl tech-border mt-12 group">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">schedule</span>
                <h4 className="font-bold text-lg mb-2 text-white">Time Saving</h4>
                <p className="text-sm text-slate-400">80% faster grinding cycles for increased productivity.</p>
                <div className="mt-4 text-3xl font-bold text-primary">80%</div>
              </div>
              <div className="glass-panel p-8 rounded-2xl tech-border -mt-12 group">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">precision_manufacturing</span>
                <h4 className="font-bold text-lg mb-2 text-white">Particle Size</h4>
                <p className="text-sm text-slate-400">Achieve minimum particle size of 0.1μm for nano-scale processing.</p>
                <div className="mt-4 text-3xl font-bold text-primary">0.1μm</div>
              </div>
              <div className="glass-panel p-8 rounded-2xl tech-border group">
                <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">sync</span>
                <h4 className="font-bold text-lg mb-2 text-white">Continuous Operation</h4>
                <p className="text-sm text-slate-400">24/7 reliable operation for industrial production needs.</p>
                <div className="mt-4 text-3xl font-bold text-primary">24/7</div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white leading-tight">Technical Excellence <br/><span className="text-primary">Unmatched Performance</span></h2>
              <p className="text-lg text-slate-400 mb-8 font-light">
                Our advanced milling technology delivers superior results compared to traditional methods. With patented designs and innovative features, we set the standard for grinding equipment performance.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded bg-primary/20 border border-primary text-primary flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm">Advanced Control System</h5>
                    <p className="text-sm text-slate-500 mt-1">Precise speed and time control for consistent results every time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded bg-primary/20 border border-primary text-primary flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm">High-Quality Materials</h5>
                    <p className="text-sm text-slate-500 mt-1">Premium construction for durability and minimal contamination.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded bg-primary/20 border border-primary text-primary flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <span className="material-symbols-outlined text-[16px]" aria-hidden="true">check</span>
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm">Intelligent Safety Features</h5>
                    <p className="text-sm text-slate-500 mt-1">Automatic overload protection and emergency stop systems.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-deep-navy relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-wider-2 mb-2 block">Customer Support</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Support Services</h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
            <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive support services to ensure you get the most out of our grinding equipment solutions.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-primary border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">support_agent</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">Technical Support</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">Expert technical assistance to resolve any issues and optimize performance.</p>
                <div className="mt-auto">
                  <a href="contact.html" className="w-full py-3 bg-primary/10 border border-primary/30 text-primary rounded-lg font-bold hover:bg-primary/20 transition-colors text-center block">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-primary border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">inventory</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">Spare Parts</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">Genuine spare parts to keep your equipment running at peak performance.</p>
                <div className="mt-auto">
                  <a href="contact.html" className="w-full py-3 bg-primary/10 border border-primary/30 text-primary rounded-lg font-bold hover:bg-primary/20 transition-colors text-center block">
                    View Parts
                  </a>
                </div>
              </div>
            </div>
            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-primary border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">school</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">Training</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">Comprehensive training programs for optimal equipment operation.</p>
                <div className="mt-auto">
                  <a href="contact.html" className="w-full py-3 bg-primary/10 border border-primary/30 text-primary rounded-lg font-bold hover:bg-primary/20 transition-colors text-center block">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-primary border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">build</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">Maintenance</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-2">Professional maintenance services to extend equipment lifespan.</p>
                <div className="mt-auto">
                  <a href="contact.html" className="w-full py-3 bg-primary/10 border border-primary/30 text-primary rounded-lg font-bold hover:bg-primary/20 transition-colors text-center block">
                    Schedule Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-deep-navy relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/10">
            <div className="lg:w-1/2 p-12 bg-surface-dark/80 backdrop-blur-md">
              <h3 className="text-3xl font-bold mb-4 text-white">Initialize Quote</h3>
              <p className="text-slate-400 mb-8">Technical sales response within <span className="text-primary font-bold">4 business hours</span>.</p>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Identify</label>
                    <input className="w-full bg-deep-navy border border-white/10 text-white rounded-lg py-3 px-4 focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-500 transition-all" placeholder="Full Name" type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Contact</label>
                    <input className="w-full bg-deep-navy border border-white/10 text-white rounded-lg py-3 px-4 focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-500 transition-all" placeholder="Work Email" type="email" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Specifications</label>
                  <select className="w-full bg-deep-navy border border-white/10 text-white rounded-lg py-3 px-4 focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                    <option>Select Material Configuration...</option>
                    <option>Zirconia (YSZ) - 250ml</option>
                    <option>Agate - 500ml</option>
                    <option>Tungsten Carbide - 100ml</option>
                    <option>Alumina - 1L</option>
                    <option>Custom OEM Project</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">Technical Requirements</label>
                  <textarea className="w-full bg-deep-navy border border-white/10 text-white rounded-lg py-3 px-4 focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-500 transition-all resize-none" placeholder="Mill model, sample type, desired fineness..." rows={4}></textarea>
                </div>
                <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase tracking-wide" type="submit">
                  Transmit Request
                </button>
              </form>
            </div>
            <div className="lg:w-1/2 relative min-h-[500px] lg:min-h-0">
              <img alt="Laboratory Environment" className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-75" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5FsyaCBQncEm-IXAD63h3gsaiKmtXPESVMV3sg_L89ro39qL91YRFtsnaNpEIE3-K4xRMMkMyb687A5QZgBLsC7IitJnGm7xaqkS-1kqqFkp_dhTREXGezAkXwb3PqeVA5EtFx2TqhPUmD8Zabp5n-5hiupUEh89B638TN_CnI7ZeCOHTrqzQ89aHOEmmNjeiOCUFiH_pRO4EWAb32Bmj1z1uQU4HZFGEO_lUmzRyAu_KZtVGVVxWfYAqxb7CrUU2lXR2MHL93-Q" loading="lazy" />
              <div className="absolute inset-0 bg-primary/30 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-white">
                <div className="flex gap-4 mb-8">
                  <div className="glass-panel p-4 rounded border-l-2 border-primary">
                    <p className="text-3xl font-bold font-mono">25+</p>
                    <p className="text-xs uppercase font-medium text-slate-300">Years Exp</p>
                  </div>
                  <div className="glass-panel p-4 rounded border-l-2 border-primary">
                    <p className="text-3xl font-bold font-mono">12k+</p>
                    <p className="text-xs uppercase font-medium text-slate-300">Global Units</p>
                  </div>
                </div>
                <h4 className="text-2xl font-bold mb-4">Direct Channel</h4>
                <div className="space-y-2">
                  <p className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">alternate_email</span>
                    <span className="font-mono">sales@stdmaterial.com</span>
                  </p>
                  <p className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-sm text-primary" aria-hidden="true">call</span>
                    <span className="font-mono">+86 731 8888 8888</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
        </>
        } />
      </Routes>
      {!isAdminRoute && <FloatingContactButton />}
    </div>
  )
}

export default App