import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, Play } from "lucide-react";
import { UserRole } from "../../types";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2200&auto=format&fit=crop",
    title: ["COMPASSIONATE", "CARE"],
    subtitle: "Bridging the gap between families and professional caregivers.",
  },
  {
    img: "https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=2200&auto=format&fit=crop",
    title: ["PEACE OF MIND", "REAL-TIME"],
    subtitle: "Live vitals, meal logs, and verified visits in one secure app.",
  },
  {
    img: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=2200&auto=format&fit=crop",
    title: ["SMART HEALTH", "TRACKING"],
    subtitle: "Evidence-based monitoring powered by the Gemini Care Copilot.",
  },
  {
    img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2200&auto=format&fit=crop",
    title: ["FAMILY", "CONNECTION"],
    subtitle: "Keep the whole care team in the loop, no matter where you are.",
  },
  {
    img: "https://images.unsplash.com/photo-1581579186913-45ac3e6e3dd2?q=80&w=2200&auto=format&fit=crop",
    title: ["EMPOWERING", "CAREGIVERS"],
    subtitle: "Less paperwork, more time for the moments that matter.",
  },
];

interface SlideshowProps {
  onSelectRole: (role: UserRole) => void;
}

export default function Slideshow({ onSelectRole }: SlideshowProps) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[100vh] overflow-hidden bg-[#1F1F1F]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          {/* Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.img})` }}
          />
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-[#1F1F1F]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      ))}

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6">
        <div className="max-w-5xl">
            {slides.map((slide, i) => (
                i === current && (
                    <div key={i} className="flex flex-col items-center">
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.95] animate-in slide-in-from-bottom-8 fade-in duration-700">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570]">
                                {slide.title[0]}
                            </span>
                            <span className="block drop-shadow-2xl">
                                {slide.title[1]}
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl tracking-wide mb-10 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-100 drop-shadow-md">
                            {slide.subtitle}
                        </p>

                        {/* Call to Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
                             <button 
                                onClick={() => onSelectRole(UserRole.CAREGIVER)}
                                className="px-8 py-4 bg-[#0B57D0] text-white rounded-full font-bold text-lg hover:bg-[#0842A0] transition-all shadow-[0_0_20px_rgba(11,87,208,0.5)] hover:shadow-[0_0_30px_rgba(11,87,208,0.7)] flex items-center justify-center transform hover:-translate-y-1"
                             >
                                Download App <ChevronRight className="w-5 h-5 ml-1" />
                             </button>
                             <button 
                                onClick={() => onSelectRole(UserRole.FAMILY)}
                                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
                             >
                                Family Login
                             </button>
                        </div>
                    </div>
                )
            ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <button 
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-colors z-20 hidden md:block" 
        onClick={prevSlide}
      >
        <ArrowLeft className="w-10 h-10" />
      </button>
      <button 
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white transition-colors z-20 hidden md:block" 
        onClick={nextSlide}
      >
        <ArrowRight className="w-10 h-10" />
      </button>

      {/* Bottom Indicators & Counter */}
      <div className="absolute bottom-10 left-0 right-0 z-20 px-10 flex justify-between items-end">
          {/* Dots */}
          <div className="flex space-x-3">
             {slides.map((_, i) => (
                 <button 
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ease-out ${i === current ? "w-16 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "w-4 bg-white/20 hover:bg-white/40"}`}
                 />
             ))}
          </div>

          {/* Counter */}
          <div className="font-mono text-white/60 text-sm tracking-widest hidden md:block">
            0{current + 1} <span className="mx-2 text-white/20">/</span> 0{slides.length}
          </div>
      </div>
    </div>
  );
}