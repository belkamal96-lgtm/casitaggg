import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Recipient } from '../types';
import { sounds } from '../lib/audio';
import { CASH_APP_LOGO_URL } from '../lib/avatar';
import { CashAppVerifiedBadge } from './CashAppVerifiedBadge';

interface SuccessScreenProps {
  amount: number;
  recipientName: string;
  recipient?: Recipient | null;
  type?: 'sent' | 'add_cash';
  onDone: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  amount,
  recipientName,
  recipient,
  type = 'sent',
  onDone,
}) => {
  const [showToast, setShowToast] = useState(true);
  const formattedAmount = `$${amount > 0 ? amount.toFixed(amount % 1 === 0 ? 0 : 2) : '10'}`;

  useEffect(() => {
    // Show 2-second popup notification after payment is sent
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDoneClick = () => {
    sounds.playKeypadTap();
    onDone();
  };

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 select-none overflow-hidden relative font-sans">
      {/* 2-Second iOS Style Top Notification Popup */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute top-3 left-4 right-4 z-50 pointer-events-none"
          >
            <div className="bg-zinc-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-zinc-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={CASH_APP_LOGO_URL}
                  alt="Cash App"
                  className="w-8 h-8 rounded-xl shrink-0 shadow-sm"
                />
                <div className="min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold tracking-tight text-emerald-400 uppercase">Cash App</span>
                    <span className="text-[10px] text-zinc-400">now</span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-100 truncate mt-0.5 flex items-center gap-1">
                    <span>
                      {type === 'add_cash'
                        ? `Added ${formattedAmount} to Cash App`
                        : `Sent ${formattedAmount} to ${recipientName || 'contact'}`}
                    </span>
                    {recipient?.verified && <CashAppVerifiedBadge className="w-3 h-3" />}
                  </p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Close Button */}
      <div className="flex justify-end px-5 pt-4 z-10">
        <button
          onClick={handleDoneClick}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          title="Close"
        >
          <X className="w-6 h-6 stroke-[2]" />
        </button>
      </div>

      {/* Centered Main Success Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-sm mx-auto w-full -mt-6">
        {/* Large Green Checkmark Circle */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="w-20 h-20 bg-[#00D632] rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/25"
        >
          <Check className="w-12 h-12 stroke-[3]" />
        </motion.div>

        {/* Dynamic Success Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight inline-flex items-center justify-center flex-wrap gap-1.5">
            {type === 'add_cash' ? (
              <span>You added {formattedAmount} to your Cash App</span>
            ) : (
              <>
                <span>You sent {formattedAmount} to {recipientName || 'your contact'}</span>
                {recipient?.verified && <CashAppVerifiedBadge className="w-5 h-5 ml-0.5" />}
              </>
            )}
          </h2>
        </motion.div>

        {/* Centered Done Pill Button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleDoneClick}
          className="w-full max-w-xs py-3.5 px-8 rounded-full bg-[#00D632] hover:bg-[#00C244] text-white font-extrabold text-base transition-all active:scale-95 shadow-md shadow-emerald-500/20 text-center cursor-pointer"
        >
          Done
        </motion.button>
      </div>
    </div>
  );
};

