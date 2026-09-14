import React from 'react';
import {
  Scan,
  ChevronDown,
  ChevronLeft,
  Building2,
  CreditCard,
  Search,
  Clock,
} from 'lucide-react';
import { TabType, UserProfile } from '../types';
import { sounds } from '../lib/audio';
import { handleAvatarImgError } from '../lib/avatar';

interface KeypadScreenProps {
  amountStr: string;
  setAmountStr: React.Dispatch<React.SetStateAction<string>>;
  onPayClick: () => void;
  onRequestClick: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenQr: () => void;
}

export const KeypadScreen: React.FC<KeypadScreenProps> = ({
  amountStr,
  setAmountStr,
  onPayClick,
  onRequestClick,
  activeTab,
  setActiveTab,
  userProfile,
  onOpenProfile,
  onOpenQr,
}) => {
  const handleDigit = (digit: string) => {
    sounds.playKeypadTap();
    if (digit === '.') {
      if (amountStr.includes('.')) return;
      if (amountStr === '') setAmountStr('0.');
      else setAmountStr(amountStr + '.');
      return;
    }

    if (amountStr === '0' || amountStr === '') {
      setAmountStr(digit);
    } else {
      // Limit decimal places to 2
      if (amountStr.includes('.')) {
        const parts = amountStr.split('.');
        if (parts[1] && parts[1].length >= 2) return;
      }
      if (amountStr.length < 7) {
        setAmountStr(amountStr + digit);
      }
    }
  };

  const handleBackspace = () => {
    sounds.playKeypadTap();
    if (amountStr.length <= 1) {
      setAmountStr('0');
    } else {
      setAmountStr(amountStr.slice(0, -1));
    }
  };

  const formattedDisplay = amountStr === '' || amountStr === '0' ? '$0' : `$${amountStr}`;

  return (
    <div className="flex flex-col h-full bg-[#00D632] text-white select-none relative overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 z-10">
        <button
          onClick={() => {
            sounds.playKeypadTap();
            onOpenQr();
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 text-white transition-all active:scale-95"
          title="Scan QR Code"
        >
          <Scan className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => {
            sounds.playKeypadTap();
            onOpenProfile();
          }}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 hover:border-white transition-all active:scale-95 shadow-sm"
          title="User Profile"
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-full h-full object-cover"
            onError={(e) => handleAvatarImgError(e, userProfile.cashtag || userProfile.name)}
          />
        </button>
      </div>

      {/* Main Center Display */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto px-4 z-10">
        {/* Amount Display */}
        <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight drop-shadow-sm transition-all">
          {formattedDisplay}
        </h1>

        {/* Currency Dropdown Pill */}
        <div className="mt-4 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-emerald-800/25 text-emerald-100 text-xs font-semibold cursor-pointer hover:bg-emerald-800/40 transition-colors">
          <span>USD</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="px-8 pb-3 z-10 max-w-sm mx-auto w-full">
        <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-center">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '<'].map((key) => {
            if (key === '<') {
              return (
                <button
                  key="backspace"
                  onClick={handleBackspace}
                  className="h-14 flex items-center justify-center text-white/90 hover:text-white active:scale-90 transition-transform font-medium"
                >
                  <ChevronLeft className="w-7 h-7 stroke-[2.5]" />
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => handleDigit(key)}
                className="h-14 flex items-center justify-center text-2xl font-bold text-white hover:text-white/80 active:scale-90 transition-transform"
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons: Request & Pay */}
      <div className="px-6 pb-5 z-10 max-w-md mx-auto w-full flex items-center gap-3">
        <button
          onClick={() => {
            sounds.playKeypadTap();
            onRequestClick();
          }}
          className="flex-1 py-3.5 px-6 rounded-full bg-emerald-900/30 hover:bg-emerald-900/40 text-white font-bold text-base transition-all active:scale-95 text-center shadow-inner"
        >
          Request
        </button>

        <button
          onClick={() => {
            sounds.playKeypadTap();
            onPayClick();
          }}
          className="flex-1 py-3.5 px-6 rounded-full bg-emerald-900/30 hover:bg-emerald-900/40 text-white font-bold text-base transition-all active:scale-95 text-center shadow-inner"
        >
          Pay
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-[#00B82B] px-6 py-3.5 flex items-center justify-between z-10 border-t border-white/10">
        <button
          onClick={() => {
            sounds.playKeypadTap();
            setActiveTab('banking');
          }}
          className={`flex flex-col items-center justify-center p-1 transition-all ${
            activeTab === 'banking' ? 'text-white scale-110' : 'text-white/60 hover:text-white/90'
          }`}
          title="Banking"
        >
          <Building2 className="w-6 h-6 stroke-[2]" />
        </button>

        <button
          onClick={() => {
            sounds.playKeypadTap();
            setActiveTab('card');
          }}
          className={`flex flex-col items-center justify-center p-1 transition-all ${
            activeTab === 'card' ? 'text-white scale-110' : 'text-white/60 hover:text-white/90'
          }`}
          title="Cash Card"
        >
          <CreditCard className="w-6 h-6 stroke-[2]" />
        </button>

        <button
          onClick={() => {
            sounds.playKeypadTap();
            setActiveTab('keypad');
          }}
          className={`flex flex-col items-center justify-center p-1 transition-all ${
            activeTab === 'keypad' ? 'text-white scale-110 font-bold' : 'text-white/60 hover:text-white/90'
          }`}
          title="Cash Keypad"
        >
          <span className="text-2xl font-black leading-none">$</span>
        </button>

        <button
          onClick={() => {
            sounds.playKeypadTap();
            setActiveTab('invest');
          }}
          className={`flex flex-col items-center justify-center p-1 transition-all ${
            activeTab === 'invest' ? 'text-white scale-110' : 'text-white/60 hover:text-white/90'
          }`}
          title="Stocks & Crypto"
        >
          <Search className="w-6 h-6 stroke-[2]" />
        </button>

        <button
          onClick={() => {
            sounds.playKeypadTap();
            setActiveTab('activity');
          }}
          className={`flex flex-col items-center justify-center p-1 transition-all ${
            activeTab === 'activity' ? 'text-white scale-110' : 'text-white/60 hover:text-white/90'
          }`}
          title="Activity"
        >
          <Clock className="w-6 h-6 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
