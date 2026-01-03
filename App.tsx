
import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Lightbulb, 
  Wrench, 
  ShieldCheck, 
  Fan, 
  Power, 
  ArrowRight, 
  Menu, 
  X,
  Thermometer,
  Home
} from 'lucide-react';

/**
 * UTILITIES
 */
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setProgress(scroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return progress;
};

const useOnScreen = (ref: React.RefObject<HTMLElement>, threshold = 0.1) => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, threshold]);
  return isIntersecting;
};

/**
 * COMPONENTS
 */

const NoiseOverlay = () => (
  <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay">
    <svg className='w-full h-full'>
      <filter id='noiseFilter'>
        <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch' />
      </filter>
      <rect width='100%' height='100%' filter='url(#noiseFilter)' />
    </svg>
  </div>
);

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, onClick }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </button>
  );
};

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className, style }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        ...style
      }}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * SECTIONS
 */

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex flex-col justify-center overflow-hidden bg-slate-50">
      <div className="container mx-auto px-4 z-10 flex flex-col items-start justify-center">
        <div className="overflow-hidden">
          <span className={`block text-sm md:text-lg text-slate-500 mb-2 tracking-widest uppercase transition-transform duration-1000 delay-500 ${loaded ? 'translate-y-0' : 'translate-y-full'}`}>
            YP Electrical and Civil Works
          </span>
        </div>
        
        <div className="overflow-hidden w-full">
          <h1 className={`text-[3.5rem] leading-none sm:text-7xl md:text-8xl lg:text-9xl font-black text-slate-900 tracking-tighter transition-transform duration-1000 delay-300 ${loaded ? 'translate-y-0' : 'translate-y-[110%]'}`}>
            EXPERT
          </h1>
        </div>
        <div className="overflow-hidden w-full">
          <h1 className={`text-[3.5rem] leading-none sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter transition-transform duration-1000 delay-500 ${loaded ? 'translate-y-0' : 'translate-y-[110%]'}`}>
            SOLUTIONS
          </h1>
        </div>
        
        <p className={`mt-6 text-lg text-slate-600 max-w-md transition-opacity duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          Professional installation, repair, and upgrades for residential and commercial needs.
        </p>

        <div className={`mt-8 transition-opacity duration-1000 delay-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
           <MagneticButton 
             onClick={() => window.location.href = 'tel:9035309704'}
             className="bg-slate-900 text-white px-8 py-4 rounded-full flex items-center gap-3 hover:bg-slate-800 shadow-lg"
           >
              Book Service <ArrowRight size={20} />
           </MagneticButton>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 w-full overflow-hidden opacity-5 pointer-events-none">
        <div className="whitespace-nowrap animate-marquee">
          <span className="text-6xl md:text-9xl font-black mx-4">REPAIRS</span>
          <span className="text-6xl md:text-9xl font-black mx-4 text-stroke">INSTALLATION</span>
          <span className="text-6xl md:text-9xl font-black mx-4">WIRING</span>
          <span className="text-6xl md:text-9xl font-black mx-4 text-stroke">LIGHTING</span>
          <span className="text-6xl md:text-9xl font-black mx-4">REPAIRS</span>
          <span className="text-6xl md:text-9xl font-black mx-4 text-stroke">INSTALLATION</span>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    {
      title: "Outlets & Switches",
      bgImage: "https://i.postimg.cc/VkxXKGmZ/image.png",
      items: ["Installation", "Relocation", "Repair", "Smart Switches"],
      icon: <Power size={20} />
    },
    {
      title: "Lighting Solutions",
      bgImage: "https://i.postimg.cc/90DM52Bw/image.png",
      items: ["Fixture Installation", "Outdoor Lighting", "LED Upgrades"],
      icon: <Lightbulb size={20} />
    },
    {
      title: "Panel & Wiring",
      bgImage: "https://i.postimg.cc/9M55FhVx/image.png",
      items: ["Panel Repair", "Breaker Upgrades", "Full House Wiring"],
      icon: <Zap size={20} />
    },
    {
      title: "Fan Services",
      bgImage: "https://i.postimg.cc/FR8ZQrQD/image.png",
      items: ["Ceiling Fans", "Exhaust Fans", "Repair & Balancing"],
      icon: <Fan size={20} />
    },
    {
      title: "Residential A/C",
      bgImage: "https://i.postimg.cc/xTRzvfFW/image.png",
      items: ["Installation", "Maintenance", "Fuse/Resistor Change"],
      icon: <Thermometer size={20} />
    },
    {
      title: "Security Systems",
      bgImage: "https://i.postimg.cc/Jn51fnJ0/image.png",
      items: ["CCTV Installation", "Alarm Systems", "Motion Sensors"],
      icon: <ShieldCheck size={20} />
    }
  ];

  return (
    <section className="lg:h-screen lg:flex lg:flex-col lg:justify-center bg-white py-16 lg:py-0 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-6 lg:mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">Our Services</h2>
          <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {services.map((service, idx) => (
            <TiltCard 
              key={idx} 
              className="relative overflow-hidden rounded-2xl md:rounded-[2rem] aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/3] group shadow-md"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${service.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-95" />
              <div className="absolute inset-0 p-4 lg:p-6 flex flex-col justify-end text-white relative z-10">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-600/20 backdrop-blur-md flex items-center justify-center mb-2 border border-blue-400/30">
                  {service.icon}
                </div>
                <h3 className="text-sm md:text-2xl lg:text-xl font-bold mb-1 leading-tight drop-shadow-md">{service.title}</h3>
                <ul className="space-y-0.5">
                  {service.items.map((item, i) => (
                    <li key={i} className="text-[9px] md:text-sm text-slate-200 flex items-center gap-1 font-medium drop-shadow-sm">
                      <span className="w-1 h-1 bg-blue-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const FullServiceList = () => {
  const fullList = [
    "Electrical outlet & switch installation", "Electrical outlet & switch relocation", 
    "Electrical outlet & switch repair", "Light fixture installation", 
    "Outdoor lighting installation", "Electrical fixture installation",
    "Electrical fuse changing", "Electrical heat resistor changing", 
    "Electrical inspections", "Electrical panel repair", 
    "Electrical panel replacement or upgrading", "Electrical parts assembly",
    "Electrical power restoration", "Electrical wiring installation", 
    "Electrical wiring repair", "Fan installation", "Fan repair", 
    "General alarm installation", "General repairs", "Ground wire installation", 
    "Installation", "Light fixture repair", "Residential A/C", 
    "Security system installation"
  ];

  return (
    <section className="lg:h-screen lg:flex lg:flex-col lg:justify-center bg-slate-50 py-16 lg:py-0 border-t border-slate-200 overflow-hidden">
      <div className="container mx-auto px-4">
         <h3 className="text-2xl md:text-4xl font-bold mb-8 lg:mb-12 text-center text-slate-800">Comprehensive Service Menu</h3>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 lg:gap-y-10 max-w-7xl mx-auto">
            {fullList.map((item, i) => (
               <div key={i} className="flex items-start gap-3 text-[11px] md:text-base text-slate-700 hover:text-blue-600 transition-colors">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 shrink-0"></div>
                  <span className="leading-tight font-medium">{item}</span>
               </div>
            ))}
         </div>
      </div>
    </section>
  );
};

const ProjectsScroll = () => {
  const projects = [
    { title: "Smart Home Wiring", loc: "Residential Villa", id: "01" },
    { title: "Office Lighting", loc: "Tech Park", id: "02" },
    { title: "Panel Upgrade", loc: "Old Apartment", id: "03" },
    { title: "Outdoor Security", loc: "Gated Community", id: "04" },
  ];

  return (
    <section className="lg:h-screen lg:flex lg:flex-col lg:justify-center bg-slate-900 text-white py-16 lg:py-0 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 lg:mb-12">Recent Work</h2>
        <div className="flex lg:grid lg:grid-cols-2 lg:gap-8 overflow-x-auto snap-x snap-mandatory gap-4 pb-4 lg:pb-0 scrollbar-hide">
          {projects.map((p) => (
            <div key={p.id} className="snap-center shrink-0 w-[85vw] md:w-auto bg-slate-800 rounded-3xl p-6 lg:p-12 border border-slate-700 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl lg:text-8xl font-black text-slate-600">
                  {p.id}
               </div>
               <div className="mt-8 relative z-10">
                  <h3 className="text-2xl md:text-4xl lg:text-3xl font-bold mb-2">{p.title}</h3>
                  <p className="text-blue-400 lg:text-xl">{p.loc}</p>
               </div>
               <div className="mt-6 flex justify-end">
                  <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                     <ArrowRight size={24} />
                  </div>
               </div>
               <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
    const steps = [
        { num: '01', title: 'Inspection', desc: 'We assess the electrical issue or site requirements.' },
        { num: '02', title: 'Quote', desc: 'Transparent pricing with parts included.' },
        { num: '03', title: 'Repair', desc: 'Safety-first execution by certified electricians.' },
    ];

    return (
        <section className="lg:h-screen lg:flex lg:flex-col lg:justify-center bg-slate-50 py-20 lg:py-0 overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold mb-12 lg:mb-20 text-center">How We Work</h2>
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 max-w-6xl mx-auto items-stretch">
                    {steps.map((step, index) => (
                        <div 
                            key={index} 
                            className="flex-1 bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-slate-100 flex flex-col items-center text-center gap-6"
                        >
                            <div className="w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl lg:text-3xl">
                                {step.num}
                            </div>
                            <div>
                                <h3 className="text-xl lg:text-3xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-sm lg:text-lg text-slate-600 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const StatsSection = () => {
    return (
        <section className="lg:h-screen lg:flex lg:flex-col lg:justify-center bg-[#eef0f4] py-20 lg:py-0 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-12 max-w-7xl mx-auto">
                    {[
                        { label: 'Repairs', val: '500+' },
                        { label: 'Clients', val: '200+' },
                        { label: 'Years', val: '10+' },
                        { label: 'Staff', val: '15' },
                    ].map((stat, i) => (
                        <div key={i} className="rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 text-center flex flex-col justify-center aspect-square" 
                             style={{
                                 background: '#eef0f4',
                                 boxShadow:  '12px 12px 30px #d1d9e6, -12px -12px 30px #ffffff'
                             }}>
                            <h3 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-700 mb-1">{stat.val}</h3>
                            <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs lg:text-base tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const RevealSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useOnScreen(ref, 0.3);

    return (
        <section ref={ref} className="lg:h-screen lg:flex lg:flex-col lg:justify-center bg-slate-900 text-white py-24 lg:py-0 relative overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-10 lg:mb-16 text-center relative z-10">
                    Safety First
                </h2>
                <div className={`relative w-full lg:max-w-6xl aspect-video bg-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-[1.5s] ease-out ${inView ? 'clip-path-full' : 'clip-path-circle'}`}>
                     <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-slate-800 flex items-center justify-center">
                        <Home size={100} className="text-white/10 lg:scale-150" />
                        <div className="absolute bottom-6 left-6 right-6 lg:bottom-16 lg:left-16 lg:max-w-xl bg-black/60 backdrop-blur-xl p-6 lg:p-10 rounded-2xl border border-white/10">
                            <p className="text-base lg:text-2xl font-light leading-relaxed">Certified residential wiring & maintenance specialists with a 100% safety track record for over a decade.</p>
                        </div>
                     </div>
                </div>
            </div>
        </section>
    );
};

const LocationSection = () => {
    return (
        <section className="lg:h-screen lg:flex lg:flex-col lg:justify-center bg-slate-900 text-white py-16 lg:py-0 overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-5xl font-bold mb-10 lg:mb-12 text-center">Visit Our Office</h2>
                <div className="w-full h-[400px] lg:h-[75vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-700 relative z-10">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.0241005846695!2d77.59677346415347!3d12.947159266457772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15527b416bdb%3A0xe18434c3a2661c8a!2sYP%20Electrical%20and%20Civil%20Works!5e0!3m2!1sen!2sin!4v1767464258126!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="YP Electrical Location"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <div className="bg-slate-900 pt-0">
            <footer className="bg-slate-950 text-white py-12 rounded-t-[3rem] border-t border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tighter">YP.</h2>
                    <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-8 text-sm lg:text-lg text-slate-400">
                        <span>Electrician Services</span>
                        <span>•</span>
                        <span>Civil Works</span>
                        <span>•</span>
                        <span>Maintenance</span>
                    </div>
                    <a 
                        href="tel:9035309704"
                        className="inline-block bg-blue-600 text-white px-8 py-4 lg:px-12 lg:py-5 rounded-full font-bold text-sm lg:text-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                        Contact Now
                    </a>
                    <p className="mt-12 text-xs lg:text-sm text-slate-600">&copy; 2025 YP Electrical. Premium Engineering Solutions.</p>
                </div>
            </footer>
        </div>
    );
};

/**
 * MAIN LAYOUT
 */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();

  return (
    <div className="font-sans text-slate-900 bg-slate-50 selection:bg-blue-500 selection:text-white overflow-x-hidden w-full">
      <NoiseOverlay />

      <div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-[60] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <nav className="fixed top-0 left-0 w-full z-40 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="text-2xl font-black tracking-tighter cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>YP.</div>
        <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      <div className={`fixed inset-0 bg-slate-950 z-30 flex items-center justify-center transition-transform duration-700 cubic-bezier(0.85, 0, 0.15, 1) ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
         <ul className="text-center space-y-8 lg:space-y-12">
            {['Home', 'Services', 'Projects', 'Contact'].map((item, idx) => (
                <li key={item} style={{ transitionDelay: `${idx * 100}ms` }} className={`transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <a href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-4xl lg:text-7xl font-bold text-slate-500 hover:text-white transition-colors tracking-tighter">
                        {item}
                    </a>
                </li>
            ))}
         </ul>
      </div>

      <main className="relative z-10 w-full">
        <HeroSection />
        <ServicesSection />
        <FullServiceList />
        <ProjectsScroll />
        <ProcessSection />
        <StatsSection />
        <RevealSection />
        <LocationSection />
        <Footer />
      </main>
    </div>
  );
}
