import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Info } from 'lucide-react';

interface TikTokAuthor {
  nickname: string;
  unique_id: string;
  avatar: string;
}

interface TikTokData {
  title: string;
  cover: string;
  play: string;
  hdplay?: string;
  wmplay: string;
  music: string;
  duration: number;
  digg_count: number;
  comment_count: number;
  play_count: number;
  author: TikTokAuthor;
  images?: string[];
}

export default function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TikTokData | null>(null);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError('');
    setData(null);
    setIsPlaying(false);

    try {
      const response = await fetch('/api/fetch-tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to fetch video');
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (downloadUrl: string) => {
    const proxyUrl = `/api/download?url=${encodeURIComponent(downloadUrl)}`;
    const a = document.createElement('a');
    a.href = proxyUrl;
    a.download = 'dave_download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#111111] font-sans border-t-8 border-black overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6 bg-transparent">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="DAVE Downloader Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm border border-gray-200" />
          <span className="font-black text-xl tracking-tighter uppercase">DAVE Downloader</span>
        </div>
        <nav className="flex gap-4 md:gap-8 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-gray-400">
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-10 px-4 md:px-10 w-full">
        
        {/* Hero Section */}
        <div className="w-full max-w-3xl mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Download TikTok Videos Seamlessly.</h1>
          <p className="text-gray-500 text-sm mb-8 font-medium italic">Paste the URL below to fetch high-quality assets without watermarks.</p>
          
          <form onSubmit={handleFetch} className="w-full relative">
            <div className="flex flex-col md:flex-row gap-2 p-2 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Masukan URL Tiktok Anda"
                className="flex-1 px-4 py-3 outline-none text-sm font-medium bg-transparent"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors uppercase text-xs tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing</span>
                  </>
                ) : (
                  'Download'
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl flex items-center gap-3 text-sm text-left"
                >
                  <Info size={16} />
                  <p className="font-bold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Preview Section */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-5xl flex flex-col md:flex-row gap-6 md:gap-10 pb-20"
            >
              {/* Media Preview (Left) */}
              <div className="w-full md:w-2/5 aspect-[9/16] bg-gray-100 rounded-3xl relative overflow-hidden shadow-sm flex items-center justify-center border border-gray-200 group">
                {data.images && data.images.length > 0 ? (
                  <div 
                    className="w-full h-full flex overflow-x-auto snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {data.images.map((img, idx) => (
                      <div key={idx} className="shrink-0 w-full h-full snap-center relative">
                        <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                          {idx + 1} / {data.images!.length}
                        </div>
                      </div>
                    ))}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={data.author.avatar} alt="Avatar" className="w-6 h-6 rounded-full bg-gray-300 object-cover" />
                        <span className="text-[10px] text-white font-bold">@{data.author.unique_id}</span>
                      </div>
                      <p className="text-[10px] text-gray-200 line-clamp-1">{data.title}</p>
                    </div>
                  </div>
                ) : !isPlaying ? (
                  <>
                    <img
                      src={data.cover}
                      alt="Video Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <div 
                        onClick={() => setIsPlaying(true)}
                        className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-transform"
                      >
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black border-b-[8px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={data.author.avatar} alt="Avatar" className="w-6 h-6 rounded-full bg-gray-300 object-cover" />
                        <span className="text-[10px] text-white font-bold">@{data.author.unique_id}</span>
                      </div>
                      <p className="text-[10px] text-gray-200 line-clamp-1">{data.title}</p>
                    </div>
                  </>
                ) : (
                  <video
                    src={data.play}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Details & Actions (Right) */}
              <div className="flex-1 py-0 md:py-4 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black mb-1">Video Metadata</h2>
                    <p className="text-gray-400 text-sm">Analysis complete. Ready for export.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Engagement</p>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs font-bold">
                        <span>{formatNumber(data.digg_count)} Likes</span>
                        <span className="text-gray-400 hidden sm:inline">•</span>
                        <span>{formatNumber(data.comment_count)} Cmts</span>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Quality</p>
                      <div className="flex gap-4 text-xs font-bold">
                        <span>{data.hdplay ? '1080p Full HD' : 'Standard'}</span>
                        <span className="text-gray-400">•</span>
                        <span>{data.duration}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Select Format</p>
                      <div className="grid grid-cols-1 gap-2">
                        {data.images && data.images.length > 0 ? (
                          <button
                            onClick={() => {
                              data.images!.forEach((img, idx) => {
                                setTimeout(() => handleDownload(img), idx * 200);
                              });
                            }}
                            className="w-full flex items-center justify-between px-5 py-4 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all group"
                          >
                            <span className="font-bold text-sm">Download All Images</span>
                            <span className="text-[10px] uppercase bg-gray-100 text-black px-3 py-1.5 rounded font-black group-hover:bg-white/20 group-hover:text-white transition-colors">Download</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleDownload(data.hdplay || data.play)}
                              className="w-full flex items-center justify-between px-5 py-4 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all group"
                            >
                              <span className="font-bold text-sm">No Watermark</span>
                              <span className="text-[10px] uppercase bg-gray-100 text-black px-3 py-1.5 rounded font-black group-hover:bg-white/20 group-hover:text-white transition-colors">Download</span>
                            </button>
                            <button
                              onClick={() => handleDownload(data.wmplay)}
                              className="w-full flex items-center justify-between px-5 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group"
                            >
                              <span className="font-bold text-sm text-gray-700">Original (With Watermark)</span>
                              <span className="text-[10px] uppercase text-gray-500 bg-gray-100 px-3 py-1.5 rounded font-black group-hover:bg-gray-200 transition-colors">Download</span>
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDownload(data.music)}
                          className="w-full flex items-center justify-between px-5 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group"
                        >
                          <span className="font-bold text-sm text-gray-700">Audio Only (320kbps)</span>
                          <span className="text-[10px] uppercase text-gray-500 bg-gray-100 px-3 py-1.5 rounded font-black group-hover:bg-gray-200 transition-colors">Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}


