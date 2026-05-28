import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Disc, Music } from 'lucide-react';

const playlist = [
  { name: "Healing Summer", src: "/music/Healing Summer.mp3" },
  { name: "Just Healing Intrusmentral", src: "/music/Just Healing Intrusmentral.mp3" },
  { name: "Don't Worry", src: "/music/Don't Worry.mp3" }
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = playlist[currentSongIndex];

  // Tự động phát khi khách bấm vào màn hình lần đầu
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(err => console.log("Trình duyệt chặn autoplay:", err));
      }
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setHasInteracted(true);
    }
  };

  const handleSongEnd = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  // Phát nhạc tự động khi chuyển bài (nếu đã từng tương tác)
  useEffect(() => {
    if (hasInteracted && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
    }
  }, [currentSongIndex, hasInteracted]);

  return (
    <>
      <style>{`
        @keyframes scrollText {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-150%); }
        }
        .animate-scrollText {
          display: inline-block;
          animation: scrollText 8s linear infinite;
        }
      `}</style>
      
      <div className="fixed bottom-6 left-6 z-[99] flex items-center gap-3 bg-card/90 backdrop-blur-md border border-border shadow-lg rounded-full p-2 pr-5">
        <audio 
          ref={audioRef} 
          src={currentSong.src} 
          onEnded={handleSongEnd}
        />
        
        <motion.button
          onClick={togglePlay}
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-md cursor-pointer hover:bg-primary/90 transition-colors shrink-0 relative"
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Disc className="w-5 h-5" />
            </motion.div>
          ) : (
            <Music className="w-5 h-5" />
          )}
        </motion.button>

        <div className="overflow-hidden w-32 relative h-5 flex items-center select-none pointer-events-none mask-image-fade">
          <AnimatePresence mode="popLayout">
            {isPlaying ? (
              <motion.div
                key={currentSong.name}
                className="animate-scrollText text-xs font-semibold text-foreground whitespace-nowrap absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {currentSong.name} 🎵 Đang phát...
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                className="text-xs font-medium text-muted-foreground whitespace-nowrap absolute left-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Nhạc tạm dừng
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
