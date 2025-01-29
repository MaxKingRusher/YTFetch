import React, { useState, useEffect } from 'react';
import { Download, Youtube, AlertCircle, Info, Smartphone, Laptop, Shield, Image, Copyright, Video, ChevronDown } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const currentYear = new Date().getFullYear();

  const qualities = [
    { label: '4K (2160p)', value: '2160' },
    { label: 'Full HD (1080p)', value: '1080' },
    { label: 'HD (720p)', value: '720' },
    { label: 'SD (480p)', value: '480' },
    { label: 'Low (360p)', value: '360' }
  ];

  const getVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  useEffect(() => {
    const videoId = getVideoId(url);
    
    if (!videoId) {
      if (url) {
        setError('Please enter a valid YouTube URL');
      }
      setThumbnails([]);
      return;
    }

    setError('');
    setThumbnails([
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    ]);
  }, [url]);

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    
    const urlParts = imageUrl.split('/');
    const quality = urlParts[urlParts.length - 1].split('.')[0];
    const videoId = urlParts[urlParts.length - 2];
    
    link.download = `youtube-thumbnail-${videoId}-${quality}.jpg`;
    link.target = '_blank';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadVideo = async (quality: string) => {
    const videoId = getVideoId(url);
    if (!videoId) return;

    try {
      setDownloading(true);
      setError('');
      setShowQualityMenu(false);
      
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}&quality=${quality}`);
      
      if (!response.ok) {
        throw new Error('Failed to download video');
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `video-${quality}p.mp4`;

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError('Failed to download video. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden perspective-1000">
      {/* Background animations remain unchanged */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-1000">
        <div className="absolute -top-[5vw] -left-[5vw] w-[30vw] h-[30vw] min-w-[160px] min-h-[160px] max-w-[400px] max-h-[400px] bg-red-500/10 rounded-full blur-3xl floating-shape" style={{ transformStyle: 'preserve-3d' }} />
        <div className="absolute -bottom-[5vw] -right-[5vw] w-[30vw] h-[30vw] min-w-[160px] min-h-[160px] max-w-[400px] max-h-[400px] bg-blue-500/10 rounded-full blur-3xl floating-shape-reverse" style={{ transformStyle: 'preserve-3d' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] min-w-[200px] min-h-[200px] max-w-[800px] max-h-[800px] bg-purple-500/5 rounded-full blur-3xl pulse-shape" style={{ transformStyle: 'preserve-3d' }} />
        <div className="hidden md:block absolute top-1/4 right-1/4 w-[20vw] h-[20vw] min-w-[160px] min-h-[160px] max-w-[256px] max-h-[256px] bg-indigo-500/10 rounded-full blur-2xl rotating-shape" style={{ transformStyle: 'preserve-3d' }} />
        <div className="hidden md:block absolute bottom-1/3 left-1/3 w-[20vw] h-[20vw] min-w-[160px] min-h-[160px] max-w-[256px] max-h-[256px] bg-pink-500/10 rounded-full blur-2xl rotating-shape-reverse" style={{ transformStyle: 'preserve-3d' }} />
        <div className="absolute top-1/4 right-1/4 w-[10vw] h-[10vw] min-w-[64px] min-h-[64px] max-w-[128px] max-h-[128px] bg-yellow-500/10 rounded-full blur-2xl drifting-shape" style={{ transformStyle: 'preserve-3d' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[10vw] h-[10vw] min-w-[64px] min-h-[64px] max-w-[128px] max-h-[128px] bg-green-500/10 rounded-full blur-2xl drifting-shape" style={{ transformStyle: 'preserve-3d' }} />
        <div className="hidden lg:block absolute top-1/2 right-1/3 w-[15vw] h-[15vw] min-w-[128px] min-h-[128px] max-w-[192px] max-h-[192px] bg-cyan-500/10 rounded-full blur-2xl scaling-shape" style={{ transformStyle: 'preserve-3d' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[12vw] h-[12vw] min-w-[80px] min-h-[80px] max-w-[160px] max-h-[160px] bg-orange-500/10 rounded-full blur-2xl floating-shape" style={{ transformStyle: 'preserve-3d' }} />
        <div className="absolute top-1/3 left-1/4 w-[12vw] h-[12vw] min-w-[80px] min-h-[80px] max-w-[160px] max-h-[160px] bg-teal-500/10 rounded-full blur-2xl floating-shape-reverse" style={{ transformStyle: 'preserve-3d' }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 relative z-10">
        <div className="text-center mb-6 md:mb-8 lg:mb-12">
          <div className="flex items-center justify-center mb-3 md:mb-4">
            <Youtube className="w-[8vw] h-[8vw] min-w-[32px] min-h-[32px] max-w-[48px] max-h-[48px] text-red-500 mr-2" />
            <h1 className="text-[6vw] md:text-[4vw] lg:text-[3vw] min-text-[24px] max-text-[48px] font-bold">GetYTThumbs</h1>
          </div>
          <p className="text-gray-400 text-[3vw] md:text-[2vw] lg:text-[1.2vw] min-text-[14px] max-text-[16px] max-w-2xl mx-auto px-4">
            Download high-quality thumbnails and videos from YouTube. Simply paste the YouTube URL below
            and choose what to download.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-6 md:mb-8 lg:mb-12 px-4">
          <div className="space-y-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="w-full px-4 md:px-6 py-3 md:py-4 rounded-lg bg-gray-700/80 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-[3.5vw] md:text-[2vw] lg:text-[1vw] min-text-[14px] max-text-[16px]"
            />
            
            {url && !error && (
              <div className="relative">
                <button
                  onClick={() => !downloading && setShowQualityMenu(!showQualityMenu)}
                  disabled={downloading}
                  className={`w-full flex items-center justify-between px-4 py-3 md:py-4 ${
                    downloading ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'
                  } rounded-lg transition-all hover:shadow-lg text-[3.5vw] md:text-[2vw] lg:text-[1vw] min-text-[14px] max-text-[16px]`}
                >
                  <div className="flex items-center gap-2">
                    <Video className={`w-5 h-5 ${downloading ? 'animate-pulse' : ''}`} />
                    <span>{downloading ? 'Downloading...' : 'Download Video'}</span>
                  </div>
                  {!downloading && <ChevronDown className={`w-5 h-5 transition-transform ${showQualityMenu ? 'rotate-180' : ''}`} />}
                </button>
                
                {showQualityMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                    {qualities.map((quality) => (
                      <button
                        key={quality.value}
                        onClick={() => downloadVideo(quality.value)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center justify-between text-[3vw] md:text-[1.5vw] lg:text-[1vw] min-text-[14px] max-text-[16px]"
                      >
                        {quality.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-center text-red-400 mb-4 md:mb-6 lg:mb-8 text-[3vw] md:text-[2vw] lg:text-[1vw] min-text-[14px] max-text-[16px]">
            <AlertCircle className="w-4 md:w-5 h-4 md:h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {thumbnails.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto mb-8 md:mb-12 lg:mb-16 px-4">
            {thumbnails.map((thumb, index) => (
              <div key={index} className="bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform">
                <img
                  src={thumb}
                  alt={`YouTube thumbnail ${index + 1}`}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
                <div className="p-3 md:p-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
                    <span className="text-[3vw] md:text-[1.5vw] lg:text-[1vw] min-text-[12px] max-text-[14px] text-gray-400">
                      {index === 0 && 'Maximum Resolution (1280x720)'}
                      {index === 1 && 'Standard Definition (640x480)'}
                      {index === 2 && 'High Quality (480x360)'}
                      {index === 3 && 'Medium Quality (320x180)'}
                    </span>
                    <button
                      onClick={() => downloadImage(thumb)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all hover:shadow-lg text-[3vw] md:text-[1.5vw] lg:text-[1vw] min-text-[14px] max-text-[16px]"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl mb-8">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Info className="w-5 sm:w-6 h-5 sm:h-6 text-blue-400" />
              What is the Purpose of GetYTThumbs?
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              This website allows users to download thumbnails and videos from YouTube. These can be used in presentations, animations, creative projects, or other activities.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">How to Use GetYTThumbs</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-gray-300">
              <li><strong>Copy the Video Link:</strong> First, copy the YouTube video link you want to download from.</li>
              <li><strong>Paste the Link:</strong> Paste the link into the input box on the website.</li>
              <li><strong>Choose Download Option:</strong> Click either "Download Video" for the full video or select a thumbnail quality to download.</li>
            </ol>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
              Is It Legal to Download YouTube Content?
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              While downloading YouTube content is common, it's important to note that both videos and thumbnails are copyrighted. For personal use, downloading is generally acceptable, but for public or commercial purposes, you should obtain permission from the content owner.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Laptop className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400" />
              Device Compatibility
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Smartphone className="w-4 h-4 text-green-400" />
                  Android
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">Works seamlessly</p>
              </div>
              <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  Laptops/Desktops
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">Fully supported</p>
              </div>
              <div className="bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  iPhone
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">May require additional steps</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-400" />
              Copyright Considerations
            </h2>
            <p className="text-sm sm:text-base text-gray-300">
              Content downloaded from YouTube is protected by copyright. While personal use is generally acceptable, commercial use requires permission from the content owner to avoid potential legal issues.
            </p>
          </div>
        </div>

        <div className="text-center pb-4 text-gray-400 text-[2.5vw] md:text-[1.2vw] lg:text-[0.8vw] min-text-[12px] max-text-[14px] flex items-center justify-center gap-2">
          <Copyright className="w-4 h-4" />
          <span>
            {currentYear} GetYTThumbs. All Rights Reserved.
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;