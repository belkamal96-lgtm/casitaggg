import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { sounds } from '../lib/audio';

interface TopFaceIdVerificationProps {
  isOpen: boolean;
  amount: number;
  recipientName: string;
  recipientAvatar?: string;
  onComplete: () => void;
}

export const TopFaceIdVerification: React.FC<TopFaceIdVerificationProps> = ({
  isOpen,
  amount,
  recipientName,
  recipientAvatar,
  onComplete,
}) => {
  const [stage, setStage] = useState<'scanning' | 'success'>('scanning');

  useEffect(() => {
    if (!isOpen) {
      setStage('scanning');
      return;
    }

    setStage('scanning');
    sounds.playFaceIdScan();

    // At 1.4s switch to success state & play double ding
    const successTimer = setTimeout(() => {
      setStage('success');
      sounds.playFaceIdSuccess();
    }, 1400);

    // Exactly 2 seconds: complete verification and proceed to 3rd page
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(successTimer);
      clearTimeout(completeTimer);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <>
      {/* Subtle backdrop dimming */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
      />

      {/* iPhone Top Face ID / Dynamic Island Alert */}
      <div className="absolute top-2 inset-x-3 z-50 flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: -70, scale: 0.82, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: -70, scale: 0.82, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 340 }}
          className="w-full max-w-[370px] bg-black/95 text-white rounded-[32px] p-3.5 shadow-[0_16px_50px_rgba(0,0,0,0.85)] border border-white/20 backdrop-blur-2xl flex items-center justify-between select-none"
        >
          {/* Left: Animated Face ID Glyph / Status */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-zinc-900/90 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              <AnimatePresence mode="wait">
                {stage === 'scanning' ? (
                  <motion.div
                    key="scanning-glyph"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="relative w-7 h-7 flex items-center justify-center text-[#00ddb3]"
                  >
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ddb3] rounded-tl-xs" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ddb3] rounded-tr-xs" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ddb3] rounded-bl-xs" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ddb3] rounded-br-xs" />

                    {/* Face glyph: eyes and smile */}
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="8" cy="9" r="1" fill="currentColor" />
                      <circle cx="16" cy="9" r="1" fill="currentColor" />
                      <path d="M9 15c1 1 5 1 6 0" strokeLinecap="round" />
                    </svg>

                    {/* Vertical scanning laser line */}
                    <motion.div
                      animate={{ y: [-10, 10, -10] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-x-0 h-0.5 bg-[#00ddb3] shadow-[0_0_8px_#00ddb3]"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-glyph"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 14, stiffness: 350 }}
                    className="w-8 h-8 rounded-full bg-[#00D632] text-black flex items-center justify-center shadow-[0_0_14px_rgba(0,214,50,0.6)]"
                  >
                    <Check className="w-5 h-5 stroke-[3.5]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Middle: Text Details */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-white">Face ID</span>
                {stage === 'scanning' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ddb3] animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D632]" />
                )}
              </div>
              <span className="text-[11px] font-semibold text-zinc-300">
                {stage === 'scanning' ? 'Verifying with Face ID...' : 'Verified & Approved'}
              </span>
            </div>
          </div>

          {/* Right: Payment Amount & Recipient Mini Info */}
          <div className="flex items-center gap-2 pl-2 text-right">
            <div className="flex flex-col items-end">
              <span className="text-xs font-black text-[#00D632]">
                ${amount.toFixed(amount % 1 === 0 ? 0 : 2)}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium max-w-[80px] truncate">
                {recipientName}
              </span>
            </div>
            {recipientAvatar && (
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 shrink-0">
                <img src={recipientAvatar} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};
