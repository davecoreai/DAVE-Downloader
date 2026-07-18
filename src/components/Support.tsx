import React from 'react';
import { motion } from 'motion/react';
import { X, Download } from 'lucide-react';

interface SupportProps {
  onClose: () => void;
}

export function Support({ onClose }: SupportProps) {
  const handleDownloadQRIS = () => {
    const link = document.createElement('a');
    link.href = '/qris.jpg';
    link.download = 'qris-dave.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-[#FFFFFF] text-[#111111] flex flex-col items-center justify-center p-6 min-h-screen overflow-y-auto"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        <X size={24} />
      </button>
      
      <div className="text-center w-full max-w-md mx-auto pt-10">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-7xl md:text-8xl mb-8 flex justify-center"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-full flex items-center justify-center">
            <i className="fa-solid fa-money-bill-1-wave text-white text-5xl"></i>
          </div>
        </motion.div>
        
        <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Support DAVE</h1>
        
        <div className="bg-gray-50 rounded-3xl p-6 md:p-8 mb-8 border border-gray-200 shadow-sm">
          <div className="flex justify-center mb-6">
            <img 
              src="/qris.jpg" 
              alt="QRIS Donasi" 
              className="w-full max-w-[280px] rounded-xl shadow-md border border-gray-200 object-contain"
              onError={(e) => {
                // Fallback if image isn't loaded yet
                e.currentTarget.src = "https://via.placeholder.com/300x300.png?text=QRIS+Image+Not+Found";
              }}
            />
          </div>

          <button 
            onClick={handleDownloadQRIS}
            className="w-full bg-black text-white text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Download size={18} />
            Download QRIS
          </button>
        </div>
      </div>
    </motion.div>
  );
}
