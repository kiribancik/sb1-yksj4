import React from 'react';
import { Download, PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen">
      <img 
        src="https://i.ibb.co/w0ZQCnv/photo-2024-10-31-17-06-33.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover animate-fade-in"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center stagger-children">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="text-purple-500 text-shadow-neon">CRMP Mobile</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the ultimate urban crime role-playing game on your mobile device.
              Join thousands of players in an immersive open world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 button-pop hover-lift">
                <Download size={20} />
                Download Now
              </button>
              <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 button-pop hover-lift">
                <PlayCircle size={20} />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;