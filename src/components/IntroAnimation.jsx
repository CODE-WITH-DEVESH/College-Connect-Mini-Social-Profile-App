import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/dev.jpg';

const IntroAnimation = () => {
  const navigate = useNavigate();
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);
  const [showText3, setShowText3] = useState(false);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setShowText1(true), 500);
    const timer2 = setTimeout(() => setShowText2(true), 1000);
    const timer3 = setTimeout(() => setShowText3(true), 1500);
    const timer4 = setTimeout(() => setShowTagline(true), 2000);
    const redirectTimer = setTimeout(() => navigate('/profiles'), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-blue-500 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Matrix-style falling code */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500 text-xs font-mono"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `fall ${2 + Math.random() * 2}s infinite linear`,
            }}
          >
            {Math.random().toString(36).substring(2, 8)}
          </div>
        ))}
      </div>

      <div className="relative h-full flex flex-col md:flex-row items-center justify-center px-4">
        {/* Profile Image */}
        <div className="w-48 h-48 md:w-64 md:h-64 mb-8 md:mb-0 md:mr-12 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
          <img
            src={profileImage}
            alt="Devesh Kumar Singh Baghel"
            className="w-full h-full rounded-full object-cover relative z-10 border-4 border-transparent"
            onError={(e) => {
              console.error('Error loading profile image:', e);
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left">
          <h1
            className={`text-3xl md:text-4xl font-bold text-white mb-4 transform transition-all duration-500 ${
              showText1 ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            Hi, I'm Devesh Kumar Singh Baghel
          </h1>
          <h2
            className={`text-xl md:text-2xl text-blue-400 mb-3 transform transition-all duration-500 ${
              showText2 ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            Pursuing MCA from Invertis University
          </h2>
          <h3
            className={`text-lg md:text-xl text-purple-400 mb-6 transform transition-all duration-500 ${
              showText3 ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            Full Stack Developer & Software Engineer
          </h3>
          <p
            className={`text-blue-300 text-lg transform transition-all duration-500 ${
              showTagline ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          >
            Crafting Web Experiences That Matter ✨
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation; 