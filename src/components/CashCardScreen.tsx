import React, { useState } from 'react';
import { CreditCard, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../lib/audio';

interface CashCardScreenProps {
  userProfile: UserProfile;
}

export const CashCardScreen: React.FC<CashCardScreenProps> = ({ userProfile }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 select-none overflow-y-auto font-sans p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-black text-gray-900">Cash Card</h1>
        <button
          onClick={() => {
            sounds.playKeypadTap();
            setIsLocked(!isLocked);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            isLocked ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{isLocked ? 'Card Locked' : 'Lock Card'}</span>
        </button>
      </div>

      {/* Cash Card Display */}
      <div
        className={`w-full aspect-[1.58/1] rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
          isLocked
            ? 'bg-zinc-800 text-zinc-400 opacity-80 filter grayscale'
            : 'bg-zinc-950 text-white'
        }`}
      >
        {/* Top Card Bar */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#00D632]" />
            <span className="font-extrabold tracking-wider text-xs uppercase text-zinc-400">Cash App</span>
          </div>
          <button
            onClick={() => {
              sounds.playKeypadTap();
              setShowNumbers(!showNumbers);
            }}
            className="p-1 text-zinc-400 hover:text-white"
          >
            {showNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Card Number */}
        <div className="my-auto">
          <p className="font-mono text-lg tracking-widest text-zinc-200 font-semibold">
            {showNumbers ? '4532 •••• •••• 9102' : '•••• •••• •••• 9102'}
          </p>
          <p className="text-xs text-zinc-500 font-mono mt-1">EXP 08/29  CVV {showNumbers ? '849' : '•••'}</p>
        </div>

        {/* Bottom Cashtag signature */}
        <div className="flex justify-between items-end">
          <p className="font-bold text-sm tracking-wide text-[#00D632]">{userProfile.cashtag}</p>
          <span className="font-extrabold italic text-sm text-zinc-400">VISA</span>
        </div>
      </div>

      {/* Boosts & Offers */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Round Ups & Boosts</span>
          <span className="text-xs text-[#00D632] font-bold">Explore All</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00D632] text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">10% Off Coffee Shops</p>
            <p className="text-xs text-gray-600">Save instantly on any coffee shop purchase</p>
          </div>
        </div>
      </div>
    </div>
  );
};
