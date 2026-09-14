import React, { useState } from 'react';
import { X, QrCode, Scan } from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../lib/audio';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, userProfile }) => {
  const [tab, setTab] = useState<'mycode' | 'scan'>('mycode');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-zinc-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative font-sans">
        <button
          onClick={() => {
            sounds.playKeypadTap();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-800 p-1 rounded-full mb-6">
          <button
            onClick={() => {
              sounds.playKeypadTap();
              setTab('mycode');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              tab === 'mycode' ? 'bg-[#00D632] text-white shadow-sm' : 'text-zinc-400'
            }`}
          >
            My Code
          </button>
          <button
            onClick={() => {
              sounds.playKeypadTap();
              setTab('scan');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              tab === 'scan' ? 'bg-[#00D632] text-white shadow-sm' : 'text-zinc-400'
            }`}
          >
            Scan QR
          </button>
        </div>

        {tab === 'mycode' ? (
          <div className="flex flex-col items-center">
            <div className="w-56 h-56 bg-white p-4 rounded-3xl shadow-lg flex items-center justify-center my-2">
              {/* Simulated QR SVG */}
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <QrCode className="w-full h-full text-zinc-900 stroke-[1.5]" />
                <div className="absolute inset-auto w-12 h-12 bg-[#00D632] rounded-xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md border-2 border-white">
                  $
                </div>
              </div>
            </div>

            <h3 className="text-xl font-extrabold mt-4">{userProfile.name}</h3>
            <p className="text-sm font-bold text-[#00D632]">{userProfile.cashtag}</p>
            <p className="text-xs text-zinc-400 mt-2">Scan with Cash App camera to pay</p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full my-4">
            <div className="relative w-56 h-56 border-2 border-emerald-400/50 rounded-3xl overflow-hidden flex items-center justify-center bg-zinc-950">
              <Scan className="w-32 h-32 text-emerald-400/30 animate-pulse" />
              <div className="absolute top-0 inset-x-0 h-1 bg-[#00D632] shadow-[0_0_15px_#00D632] animate-bounce" />
            </div>
            <p className="text-sm font-semibold text-zinc-300 mt-4">Point camera at a Cash Code</p>
          </div>
        )}
      </div>
    </div>
  );
};
