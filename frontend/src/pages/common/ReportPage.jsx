import React, { useState } from 'react';
import { AlertTriangle, Send, Shield, Activity, Bell, Heart, Leaf, TreePine, PawPrint } from 'lucide-react';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

const ReportPage = () => {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    animalType: 'Dog', location: '',
    urgency: 'Medium', description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Rescue report submitted! Our team has been notified.");
    setForm({ name: '', phone: '', email: '', animalType: 'Dog', location: '', urgency: 'Medium', description: '' });
  };

  const steps = [
    { icon: <AlertTriangle size={24} />, title: "Submit Report", desc: "Fill out the form with animal details and location." },
    { icon: <Bell size={24} />, title: "Alert Sent", desc: "Nearby rescuers and NGOs are immediately notified." },
    { icon: <Shield size={24} />, title: "Rescue Team Arrives", desc: "Our team reaches the location for the rescue." },
    { icon: <Activity size={24} />, title: "Animal Gets Care", desc: "The animal is treated and moved to a safe shelter." }
  ];

  const urgencyConfig = {
    Low: { color: 'bg-emerald-500', border: 'border-emerald-500', shadow: 'shadow-emerald-500/30', text: 'text-emerald-400' },
    Medium: { color: 'bg-yellow-500', border: 'border-yellow-500', shadow: 'shadow-yellow-500/30', text: 'text-yellow-400' },
    High: { color: 'bg-orange-500', border: 'border-orange-500', shadow: 'shadow-orange-500/30', text: 'text-orange-400' },
    Critical: { color: 'bg-red-500', border: 'border-red-500', shadow: 'shadow-red-500/30', text: 'text-red-400' }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 selection:bg-emerald-500/30">
      <Navbar />
      
      <header className="py-24 px-6 md:px-10 text-center bg-gradient-to-b from-red-500/10 to-transparent relative overflow-hidden">
        <div className="absolute top-16 right-20 opacity-10 rotate-12 pointer-events-none hidden lg:block">
          <AlertTriangle size={100} strokeWidth={1} />
        </div>
        <div className="absolute bottom-10 left-20 opacity-10 -rotate-12 pointer-events-none hidden lg:block">
          <PawPrint size={80} strokeWidth={1} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-4 py-1.5 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-red-500/20">
            Emergency Report
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Report an Animal in Distress</h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed">
            Found an injured, abandoned, or distressed animal? Report it here and our network of rescuers will respond immediately.
          </p>
        </div>
      </header>

      <section className="py-10 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="bg-white/5 border border-white/10 p-8 md:p-16 rounded-[48px] max-w-3xl mx-auto shadow-2xl relative overflow-hidden group hover:border-red-500/10 transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -mr-32 -mt-32 transition-opacity duration-1000 group-hover:opacity-100 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -ml-24 -mb-24 pointer-events-none"></div>
          
          <h2 className="text-3xl font-black mb-10 text-center tracking-tight">Animal Rescue Report</h2>
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Your Name *</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 px-3 min-h-12 mb-3 text-white focus:border-red-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-red-500/20 transition-all outline-none placeholder:text-white/20" 
                  required value={form.name} onChange={p => setForm({...form, name: p.target.value})} placeholder="Enter your name" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Phone Number *</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 px-3 min-h-12 mb-3 text-white focus:border-red-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-red-500/20 transition-all outline-none placeholder:text-white/20" 
                  required value={form.phone} onChange={p => setForm({...form, phone: p.target.value})} placeholder="Enter your number" 
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Email Address</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 px-3 min-h-12 mb-3 text-white focus:border-red-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-red-500/20 transition-all outline-none placeholder:text-white/20" 
                type="email" value={form.email} onChange={p => setForm({...form, email: p.target.value})} placeholder="Enter your email" 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Animal Type *</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 px-3 min-h-12 mb-3 text-white focus:border-red-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-red-500/20 transition-all outline-none appearance-none cursor-pointer" 
                  value={form.animalType} onChange={p => setForm({...form, animalType: p.target.value})}
                >
                  <option className="bg-gray-950">Dog</option>
                  <option className="bg-gray-950">Cat</option>
                  <option className="bg-gray-950">Cow</option>
                  <option className="bg-gray-950">Bird</option>
                  <option className="bg-gray-950">Other</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Location *</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 px-3 min-h-12 mb-3 text-white focus:border-red-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-red-500/20 transition-all outline-none placeholder:text-white/20" 
                  required value={form.location} onChange={p => setForm({...form, location: p.target.value})} placeholder="Enter location" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Urgency Level *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Low', 'Medium', 'High', 'Critical'].map(level => {
                  const config = urgencyConfig[level];
                  const isActive = form.urgency === level;
                  return (
                    <button 
                      key={level}
                      type="button"
                      onClick={() => setForm({...form, urgency: level})}
                      className={`py-3 px-2 mb-3 rounded-xl text-[13px] font-black tracking-wider transition-all duration-300 border ${
                        isActive 
                        ? `${config.color} ${config.border} ${config.shadow} shadow-lg` 
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Description *</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 mb-3 text-white focus:border-red-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-red-500/20 transition-all outline-none min-h-[140px] resize-none placeholder:text-white/20" 
                required value={form.description} onChange={p => setForm({...form, description: p.target.value})} placeholder="Describe the animal's condition and the situation..." 
              />
            </div>

            <div className="p-4 mb-3 bg-red-500/5 border border-red-500/20 rounded-3xl flex items-center gap-4 group hover:border-red-500/30 transition-all duration-300">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center shrink-0 text-red-500 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle size={20} />
              </div>
              <p className="text-xs md:text-sm text-red-500/90 font-medium leading-relaxed">
                For life-threatening emergencies, please call our 24/7 helpline: <strong className="text-red-500 underline ml-1">+91 1800-123-4567</strong>
              </p>
            </div>

            <button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 mt-8 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-red-500/20 flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
            >
              <Send size={20} /> Submit Rescue Report
            </button>
          </form>
        </div>
      </section>

      <section className="py-24 px-6 md:px-10 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-emerald-500/20">
              Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">How Reporting Works</h2>
            <p className="text-white/60 text-lg">Our streamlined process ensures every report reaches the right rescuer quickly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((s, i) => (
              <div key={i} className="bg-gray-950 border border-white/10 p-10 rounded-[40px] text-center group hover:border-emerald-500/30 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-16 h-16 bg-white/5 border border-white/10 text-emerald-400 rounded-[24px] flex items-center justify-center mx-auto mb-8 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300 relative z-10">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">{s.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm relative z-10">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black pt-20 pb-10 border-t border-white/5 px-6 md:px-10 mt-10 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Heart size={20} fill="white" color="white" />
                </div>
                <span className="text-2xl font-black tracking-tight">PashuRashak</span>
              </div>
              <p className="text-white/40 max-w-md leading-relaxed">
                Empowering the community to protect and care for every life. Our platform bridges the gap between those who can help and animals in need.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-8">Quick Links</h4>
              <div className="flex flex-col gap-4 text-white/60">
                <a href="/" className="hover:text-white transition-colors">Home</a>
                <a href="/services" className="hover:text-white transition-colors">Services</a>
                <a href="/about" className="hover:text-white transition-colors">About Us</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-8">Support</h4>
              <div className="flex flex-col gap-4 text-white/60">
                <p>Email: help@pashurashak.org</p>
                <p>Phone: +91 1800-123-4567</p>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 text-center text-white/30 text-sm">
            <p>&copy; 2026 PashuRashak Animal Welfare Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Background Orbs */}
      <div className="fixed top-0 -left-64 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 -right-64 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    </div>
  );
};

export default ReportPage;