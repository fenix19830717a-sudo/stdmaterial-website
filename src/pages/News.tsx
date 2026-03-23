import React from 'react';

const News: React.FC = () => {
  return (
    <div className="bg-deep-navy text-slate-100 font-display selection:bg-primary selection:text-white">
      <section className="py-24 bg-deep-navy relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider-2 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Latest Updates
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-200 to-white text-glow">News & Events</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto font-light border-l-2 border-primary/30 pl-6">
              Stay updated with the latest news, events, and developments from Hunan Shengtongda Materials Technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-full h-48 bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary/30">article</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">event</span>
                  <span>March 21, 2026</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">New Product Launch: PM-500 Series</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-3">We are excited to announce the launch of our latest planetary ball mill series, featuring advanced control systems and enhanced performance.</p>
                <div className="mt-auto">
                  <a href="#" className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-bold">
                    <span>Read More</span>
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-full h-48 bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary/30">science</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">event</span>
                  <span>March 15, 2026</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">Participation in China International Industry Fair</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-3">Visit us at booth C123 during the China International Industry Fair to explore our latest grinding solutions.</p>
                <div className="mt-auto">
                  <a href="#" className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-bold">
                    <span>Read More</span>
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="group material-card p-1 rounded-2xl relative overflow-hidden transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-surface-dark h-full p-6 rounded-xl border border-white/5 relative z-10 flex flex-col">
                <div className="w-full h-48 bg-primary/10 rounded-lg mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary/30">trending_up</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">event</span>
                  <span>March 10, 2026</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">Company Achieves ISO 9001:2025 Certification</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-3">We are proud to announce that our quality management system has been certified to the latest ISO 9001:2025 standard.</p>
                <div className="mt-auto">
                  <a href="#" className="flex items-center gap-2 text-primary hover:text-accent transition-colors text-sm font-bold">
                    <span>Read More</span>
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <a href="#" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-deep-navy rounded font-bold hover:bg-accent hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all uppercase tracking-wide text-sm">
              <span>View All News</span>
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;