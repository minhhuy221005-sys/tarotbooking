import { motion } from 'motion/react';
import mascotImage from '../assets/facebook-mascot.png';

const facebookUrl = import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/bui.que.chy';

export function FacebookFloatButton() {
  const openFacebook = () => {
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-end justify-end">
      <motion.img
        src={mascotImage}
        alt="Mèo nhỏ chỉ vào nút Facebook"
        className="pointer-events-none absolute bottom-9 right-6 w-[150px] max-w-[calc(100vw-5rem)] select-none drop-shadow-[0_12px_18px_rgba(74,55,40,0.16)] sm:bottom-8 sm:right-7 sm:w-[185px]"
        initial={{ opacity: 0, y: 10, scale: 0.96, rotate: -2 }}
        animate={{
          opacity: 1,
          y: [0, -4, 0],
          scale: 1,
          rotate: [-2, 0.8, -2],
        }}
        transition={{
          opacity: { duration: 0.25 },
          scale: { duration: 0.25 },
          y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.button
        type="button"
        aria-label="Mở Facebook cá nhân"
        onClick={openFacebook}
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
