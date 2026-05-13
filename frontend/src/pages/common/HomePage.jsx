import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar';
import heroImage from '../../assets/hero-animal.png';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate(`/${user.role}`);
    } else {
      navigate('/register');
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
      <div id="home" className="min-h-screen bg-gray-950 text-white font-sans selection:bg-emerald-500/30">
        <Navbar />

        {/* Hero Section */}
        <main className="relative pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[90vh]">
          <div className="relative z-10" style={{ animation: 'fadeIn 1s ease-out forwards' }}>
            <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-emerald-500/20">
              Animal Welfare Platform
            </span>
            <h1 className="text-6xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6">
              Every Life <br />
              <span className="text-emerald-400 inline-block transform -rotate-2 bg-emerald-500/5 px-2">Deserves</span> <br />
              Protection
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
              Register as a Rescuer, NGO, or Doctor and contribute to animal 
              welfare. Every animal deserves help and care.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={handleGetStarted} 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-3xl font-extrabold text-base transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 hover:-translate-y-1 active:scale-95"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <a 
                href="#services" 
                className="px-8 py-4 rounded-3xl font-bold text-base transition-all border border-white/20 hover:border-white/30 hover:bg-white/5 flex items-center gap-2"
              >
                Our Services
              </a>
            </div>
          </div>

          <div className="relative lg:h-[600px] group">
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-[40px] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
            <div className="relative h-full rounded-[35px] overflow-hidden border border-white/10 shadow-2xl">
               <img src={heroImage} alt="Animal Welfare" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
            </div>
          </div>
        </main>

        {/* Services Section */}
        <section id="services" className="scroll-mt-24 py-24 px-6 md:px-10 max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-emerald-500/20">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-black">How We Help Animals</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🚑", title: "Emergency Rescue", desc: "Real-time coordination for animals in distress or accidents." },
              { icon: "🏥", title: "Medical Aid", desc: "Connecting injured animals with certified veterinary doctors." },
              { icon: "🏘️", title: "NGO Support", desc: "Empowering local shelters with resources and volunteer networks." }
            ].map((service, i) => (
              <div 
                key={i} 
                onClick={() => navigate('/services')}
                className="bg-white/5 border border-white/10 p-10 rounded-[32px] hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all duration-300 group hover:-translate-y-2 cursor-pointer"
              >
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-white/60 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="scroll-mt-24 py-24 px-6 md:px-10 bg-white/[0.02]">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4 border border-emerald-500/20">
                About Us
              </span>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Our Mission for Animal Welfare</h2>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-10">
                PashuRashak is dedicated to creating a seamless ecosystem where every animal can receive immediate help. By connecting dedicated rescuers, professional doctors, and organized NGOs, we ensure that no call for help goes unanswered.
              </p>
              <button 
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition-all border border-white/5 hover:border-white/10 active:scale-95"
                onClick={() => navigate('/register')}
              >
                Join Our Mission
              </button>
            </div>
          </div>
        </section>

        {/* Report Section */}
        <section id="report" className="scroll-mt-24 py-24 px-6 md:px-10 max-w-[1400px] mx-auto">
          <div className="bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 p-12 md:p-20 rounded-[48px] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Found an Animal in Need?</h2>
              <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                Sign in to report a rescue case and get immediate help from our network of rescuers and doctors.
              </p>
              <button 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-extrabold text-lg transition-all shadow-2xl shadow-emerald-500/20 flex items-center gap-2 mx-auto hover:-translate-y-1 active:scale-95"
                onClick={() => navigate('/login')}
              >
                Report Now <ArrowRight size={22} />
              </button>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer id="contact" className="scroll-mt-24 bg-black pt-20 pb-10 border-t border-white/5 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto">
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
                  <a href="#home" className="text-white/60 hover:text-white transition-colors">Home</a>
                  <a href="#services" className="text-white/60 hover:text-white transition-colors">Services</a>
                  <a href="#about" className="text-white/60 hover:text-white transition-colors">About Us</a>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-8">Support</h4>
                <div className="flex flex-col gap-4 text-white/60">
                  <p>Email: help@pashurashak.org</p>
                  <p>Phone: +91 1800-ANIMAL</p>
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
        <div className="fixed bottom-0 -right-64 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      </div>
    </>
  );
};

export default HomePage;