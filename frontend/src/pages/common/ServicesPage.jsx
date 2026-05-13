import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Home, Activity, Heart, Clipboard, Users, Check, Leaf, PawPrint } from 'lucide-react';
import Navbar from '../../components/Navbar';

const ServicesPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Shield size={30} />,
      title: "Emergency Rescue",
      desc: "Immediate rescue of injured, abandoned, and distressed animals. Our rescuer network is available 24/7.",
      features: ["24/7 Helpline", "Quick Response", "Safe Transport"]
    },
    {
      icon: <Home size={30} />,
      title: "Shelter Management",
      desc: "NGO-managed shelters providing food, care, and adoption support for animals.",
      features: ["Food Arrangement", "Regular Care", "Adoption Support"]
    },
    {
      icon: <Activity size={30} />,
      title: "Medical Care",
      desc: "Professional veterinary services including treatment, surgery, and health checkups.",
      features: ["Vaccination", "Surgery", "Health Checkup"]
    },
    {
      icon: <Heart size={30} />,
      title: "Donations & Campaigns",
      desc: "Run donation campaigns and manage fundraising for animal welfare initiatives.",
      features: ["Online Donations", "Campaign Management", "Donor Reports"]
    },
    {
      icon: <Clipboard size={30} />,
      title: "Case Tracking",
      desc: "Case management and tracking system for rescuers and doctors.",
      features: ["Case Registration", "Status Updates", "Reporting"]
    },
    {
      icon: <Users size={30} />,
      title: "Community Engagement",
      desc: "Bringing together volunteers, donors, and professionals for animal welfare.",
      features: ["Volunteer Network", "Community Forum", "Events"]
    }
  ];

  const roles = [
    {
      role: "Rescuer",
      icon: <Shield size={24} />,
      desc: "Rescue animals and manage cases.",
      btnText: "Become a Rescuer",
      color: "bg-rose-500",
      hoverColor: "hover:bg-rose-600",
      shadow: "shadow-rose-500/20",
      ringColor: "ring-rose-500/20"
    },
    {
      role: "NGO",
      icon: <Home size={24} />,
      desc: "Run campaigns and manage donations.",
      btnText: "Register NGO",
      color: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600",
      shadow: "shadow-emerald-500/20",
      ringColor: "ring-emerald-500/20"
    },
    {
      role: "Doctor",
      icon: <Activity size={24} />,
      desc: "Provide medical services and handle cases.",
      btnText: "Register as Doctor",
      color: "bg-sky-500",
      hoverColor: "hover:bg-sky-600",
      shadow: "shadow-sky-500/20",
      ringColor: "ring-sky-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 selection:bg-emerald-500/30">
      <Navbar />
      
      <header className="py-24 px-6 md:px-10 text-center bg-gradient-to-b from-emerald-500/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-20 right-20 opacity-10 rotate-12 pointer-events-none hidden lg:block">
          <Leaf size={120} strokeWidth={1} />
        </div>
        <div className="absolute bottom-10 left-20 opacity-10 -rotate-12 pointer-events-none hidden lg:block">
          <PawPrint size={100} strokeWidth={1} />
        </div>
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-emerald-500/20">
            Our Services
          </span>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">Our Specialized Services</h1>
          <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            PashuRashak offers a wide range of services to ensure the well-being of animals. Choose your role and contribute to a better future.
          </p>
        </div>
      </header>

      <section className="py-20 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[32px] hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all duration-300 group hover:-translate-y-2 flex flex-col relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 text-emerald-400 transform group-hover:scale-110 transition-transform duration-300">
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
              <p className="text-white/60 leading-relaxed mb-8 flex-grow">{s.desc}</p>
              <ul className="space-y-3">
                {s.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-white/80 font-medium">
                    <span className="w-5 h-5 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-10 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto text-center relative z-10">
          <div className="mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-emerald-500/20">
              Join Us
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Choose Your Role</h2>
            <p className="text-white/60 text-lg">Each role comes with specialized dashboards and features.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
            {roles.map((r, i) => (
              <div key={i} className="bg-gray-950 border border-white/10 p-10 rounded-[40px] text-center group hover:border-white/20 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-b ${r.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
                <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-8 bg-white/5 text-white transform group-hover:scale-110 transition-transform duration-300 ring-1 ${r.ringColor}`}>
                  {r.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{r.role}</h3>
                <p className="text-white/50 mb-10 text-base">{r.desc}</p>
                <button 
                  className={`${r.color} ${r.hoverColor} text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${r.shadow} w-full hover:-translate-y-1 active:scale-95`}
                  onClick={() => navigate('/register')}
                >
                  {r.btnText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black pt-20 pb-10 border-t border-white/5 px-6 md:px-10 relative overflow-hidden">
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
              <div className="flex flex-col gap-4">
                <button onClick={() => navigate('/')} className="text-left text-white/60 hover:text-white transition-colors">Home</button>
                <button onClick={() => navigate('/services')} className="text-left text-white/60 hover:text-white transition-colors">Services</button>
                <button onClick={() => navigate('/about')} className="text-left text-white/60 hover:text-white transition-colors">About Us</button>
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

export default ServicesPage;