import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import mascotImage from '../assets/facebook-mascot.png';

const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/bui.que.chy';

export function FacebookFloatButton() {
  const [showMascot, setShowMascot] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setShowMascot(false), 6500);
    const interval = window.setInterval(() => {
      setShowMascot(true);
      window.setTimeout(() => setShowMascot(false), 6500);
    }, 22000);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearInterval(interval);
    };
  }, []);

  const openFacebook = () => {
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-end justify-end">
      <AnimatePresence>
        {showMascot && (
          <motion.img
            key="facebook-mascot"
            src={mascotImage}
            alt="Mèo nhỏ chỉ vào nút Facebook"
            className="pointer-events-none absolute bottom-14 right-3 w-[230px] max-w-[calc(100vw-2rem)] select-none drop-shadow-[0_16px_24px_rgba(74,55,40,0.18)] sm:bottom-12 sm:right-12 sm:w-[300px]"
            initial={{ opacity: 0, y: 18, scale: 0.9, rotate: -2 }}
            animate={{
              opacity: 1,
              y: [0, -5, 0],
              scale: 1,
              rotate: [-2, 1, -2],
            }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{
              opacity: { duration: 0.25 },
              scale: { duration: 0.25 },
              y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label="Mở Facebook cá nhân"
        onClick={openFacebook}
        onMouseEnter={() => setShowMascot(true)}
        onFocus={() => setShowMascot(true)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-lg shadow-[#1877f2]/25 ring-4 ring-white/80 transition-colors hover:bg-[#0f6bdf] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="font-sans text-3xl font-bold leading-none" aria-hidden="true">
          f
        </span>
      </motion.button>
    </div>
  );
}
