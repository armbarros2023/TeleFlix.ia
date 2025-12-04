import React from 'react';
import { Phone } from '../components/icons/IconComponents';
import Spinner from '../components/ui/Spinner';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans">
      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer rings for animation */}
            <div className="absolute w-full h-full rounded-full bg-primary/10 animate-ping opacity-75"></div>
            <div className="absolute w-2/3 h-2/3 rounded-full bg-primary/20 animate-ping opacity-50" style={{animationDelay: '0.2s'}}></div>

            {/* Icon container */}
            <div className="relative w-28 h-28 bg-slate-700 rounded-full flex items-center justify-center border-2 border-primary/50 shadow-lg">
                <Phone className="w-14 h-14 text-primary" />
            </div>
        </div>
        <div className="mt-8 text-center">
            <span className="text-2xl font-medium text-orange-500 block leading-tight">SISTEMA</span>
            <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
              TELFIX
            </h1>
        </div>
        <p className="mt-2 text-lg text-slate-300">
          Gerenciando suas operações com eficiência.
        </p>
      </div>
      <div className="pb-10 flex items-center space-x-3">
         <Spinner className="w-5 h-5 text-slate-400" />
         <p className="text-sm text-slate-400">Carregando aplicação...</p>
      </div>
    </div>
  );
};

export default SplashScreen;