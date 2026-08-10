import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-darkBg/80 mt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-slate-300">CareerCraft AI</span>
          <span>&mdash; Powered by Gemini AI & MERN Stack</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using Node.js, Express, MongoDB & React</span>
        </div>
      </div>
    </footer>
  );
};
