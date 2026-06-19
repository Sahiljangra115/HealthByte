import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Scan, Edit3, PlusCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { GlassCard } from '../components/GlassCard';

export const ScanScreen: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    setupCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleScan = async () => {
    setIsAnalyzing(true);
    // Mocking AI analysis for now as per design system requirements
    setTimeout(() => {
      setResult({
        name: 'Grilled Chicken Salad',
        match: 94,
        calories: 420,
        protein: 28,
        carbs: 52,
        fat: 14,
        ingredients: ['Chicken Breast (150g)', 'Kale', 'Avocado', 'Lemon']
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Camera Viewfinder */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover brightness-[0.85] contrast-[1.1]"
      />
      
      {/* Viewfinder Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        {/* Corners */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white/60 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white/60 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white/60 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white/60 rounded-br-3xl"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>

        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['30%', '70%', '30%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 w-full h-[2px] bg-primary/40 shadow-[0_0_20px_rgba(48,209,88,0.8)] z-20"
        />
      </div>

      {/* Top Controls */}
      <header className="absolute top-0 left-0 w-full p-6 pt-12 flex justify-between items-center">
        <button className="w-10 h-10 glass rounded-full flex items-center justify-center">
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 glass rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      {/* Result Panel */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 w-full h-[45%] glass rounded-t-[40px] p-8 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold rounded-full tracking-wider uppercase">
                    {result.match}% Match
                  </span>
                  <div className="flex items-center gap-1 bg-secondary/20 px-2 py-0.5 rounded-full border border-secondary/30">
                    <span className="text-secondary text-[10px] font-bold uppercase tracking-tighter">LiDAR Active</span>
                  </div>
                </div>
                <h2 className="text-2xl font-headline font-extrabold text-white tracking-tight">{result.name}</h2>
              </div>
              <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-white/60" />
              </button>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
              {result.ingredients.map((ing: string, i: number) => (
                <div key={i} className="shrink-0 px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                  <span className="text-white/40 text-[9px] font-bold uppercase mb-0.5">Ingredient</span>
                  <span className="text-white text-xs font-medium">{ing}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center">
                <span className="text-white/30 text-[10px] uppercase font-bold">Portion</span>
                <span className="text-primary font-headline font-bold text-lg">1 Bowl</span>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-2">
                <div className="bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/5 p-2">
                  <span className="text-primary font-bold text-sm">{result.calories}</span>
                  <span className="text-[8px] uppercase text-white/40 font-bold">kcal</span>
                </div>
                <div className="bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/5 p-2">
                  <span className="text-secondary font-bold text-sm">{result.protein}g</span>
                  <span className="text-[8px] uppercase text-white/40 font-bold">prot</span>
                </div>
                <div className="bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/5 p-2">
                  <span className="text-tertiary font-bold text-sm">{result.carbs}g</span>
                  <span className="text-[8px] uppercase text-white/40 font-bold">carb</span>
                </div>
                <div className="bg-white/5 rounded-xl flex flex-col items-center justify-center border border-white/5 p-2">
                  <span className="text-yellow-400 font-bold text-sm">{result.fat}g</span>
                  <span className="text-[8px] uppercase text-white/40 font-bold">fat</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setResult(null)}
              className="soul-gradient w-full h-14 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-6 h-6 text-black" />
              <span className="text-black font-headline font-extrabold text-lg tracking-tight">Log This Meal</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Button */}
      {!result && (
        <div className="absolute bottom-12 left-0 w-full flex justify-center">
          <button 
            onClick={handleScan}
            disabled={isAnalyzing}
            className="w-20 h-20 rounded-full border-4 border-white/20 p-1 active:scale-95 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              {isAnalyzing ? (
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-black/10"></div>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
