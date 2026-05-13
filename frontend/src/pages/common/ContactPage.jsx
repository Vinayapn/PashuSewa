import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Heart, Leaf, TreePine } from 'lucide-react';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 selection:bg-emerald-500/30">
      <Navbar />
      
      <header className="py-24 px-6 md:px-10 text-center bg-gradient-to-b from-emerald-500/5 to-transparent relative overflow-hidden">
        <div className="absolute top-20 right-20 opacity-10 rotate-12 pointer-events-none hidden lg:block">
          <Leaf size={100} strokeWidth={1} />
        </div>
        <div className="absolute bottom-10 left-20 opacity-10 -rotate-12 pointer-events-none hidden lg:block">
          <TreePine size={80} strokeWidth={1} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-emerald-500/20">
            Contact Us
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Get in Touch</h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed">
            Have questions, suggestions, or need assistance? Our team is here to help you and the animals.
          </p>
        </div>
      </header>

      <section className="py-20 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-black mb-10 tracking-tight">Contact Information</h2>
              <div className="space-y-8">
                {[
                  { icon: <MapPin size={24} />, title: "Our Office", detail: "123 Animal Welfare Road, New Delhi, India - 110001" },
                  { icon: <Phone size={24} />, title: "Phone Number", detail: "+91 1800-123-4567" },
                  { icon: <Mail size={24} />, title: "Email Address", detail: "help@pashurashak.org" },
                  { icon: <Clock size={24} />, title: "Office Hours", detail: "Monday - Saturday: 9:00 AM - 6:00 PM" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 bg-white/5 border border-white/10 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-2">{item.title}</h4>
                      <p className="text-white/60 text-lg">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[40px] overflow-hidden h-[300px] border border-white/10 group relative">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112061.35372337!2d77.1171!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b71bf414eb5!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" height="100%" className="border-0 opacity-80 contrast-125 saturate-50 group-hover:opacity-100 group-hover:saturate-100 transition-all duration-500" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 md:p-14 rounded-[48px] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32 group-hover:bg-emerald-500/10 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 blur-[80px] -ml-24 -mb-24 group-hover:bg-teal-500/10 transition-all duration-700"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-10 tracking-tight">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Your Name</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 px-2 min-h-12 text-white focus:border-emerald-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none placeholder:text-white/20" 
                      required value={form.name} onChange={p => setForm({...form, name: p.target.value})} placeholder="Enter your name" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Email Address</label>
                    <input 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 px-2 min-h-12 mb-3 text-white focus:border-emerald-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none placeholder:text-white/20" 
                      type="email" required value={form.email} onChange={p => setForm({...form, email: p.target.value})} placeholder="Enter your email" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Subject</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 px-2 min-h-12 mb-3 text-white focus:border-emerald-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none appearance-none cursor-pointer" 
                    value={form.subject} onChange={p => setForm({...form, subject: p.target.value})}
                  >
                    <option className="bg-gray-950">General Inquiry</option>
                    <option className="bg-gray-950">Support</option>
                    <option className="bg-gray-950">Partnership</option>
                    <option className="bg-gray-950">Feedback</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-white/50 uppercase tracking-widest">Message</label>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 mb-4 text-white focus:border-emerald-500/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none min-h-[160px] resize-none placeholder:text-white/20" 
                    required value={form.message} onChange={p => setForm({...form, message: p.target.value})} placeholder="How can we help you?"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
                >
                  <Send size={20} /> Send Message
                </button>
              </form>
            </div>
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

export default ContactPage;