import React, { useState } from 'react';
import { X, Volume2, VolumeX, Shield, LogOut, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../lib/audio';
import { handleAvatarImgError } from '../lib/avatar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [cashtag, setCashtag] = useState(userProfile.cashtag);
  const [isMuted, setIsMuted] = useState(sounds.isMuted());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    sounds.playKeypadTap();
    onUpdateProfile({
      ...userProfile,
      name,
      cashtag: cashtag.startsWith('$') ? cashtag : `$${cashtag}`,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
    if (!next) sounds.playKeypadTap();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col font-sans">
        {/* Header */}
        <div className="bg-[#00D632] p-6 text-white text-center relative">
          <button
            onClick={() => {
              sounds.playKeypadTap();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-20 h-20 rounded-full border-4 border-white mx-auto shadow-md object-cover mb-2"
            onError={(e) => handleAvatarImgError(e, userProfile.cashtag || userProfile.name)}
          />
          <h3 className="text-xl font-black">{userProfile.name}</h3>
          <p className="text-sm font-semibold opacity-90">{userProfile.cashtag}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-sm focus:outline-none focus:border-[#00D632]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">$Cashtag</label>
            <input
              type="text"
              value={cashtag}
              onChange={(e) => setCashtag(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 text-sm focus:outline-none focus:border-[#00D632]"
            />
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2.5">
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-gray-400" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              )}
              <span className="text-sm font-bold text-gray-900">Sound Effects</span>
            </div>
            <button
              onClick={toggleMute}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                isMuted ? 'bg-gray-200 text-gray-600' : 'bg-[#00D632] text-white'
              }`}
            >
              {isMuted ? 'Muted' : 'Enabled'}
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-[#00D632] hover:bg-[#00C244] text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Saved Changes!</span>
              </>
            ) : (
              <span>Save Profile</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
