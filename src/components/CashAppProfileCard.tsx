import React, { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { sounds } from '../lib/audio';
import { CashAppVerifiedBadge } from './CashAppVerifiedBadge';

export interface CashAppProfile {
  display_name: string;
  formatted_cashtag: string;
  clean_cashtag: string;
  avatar: {
    image_url: string | null;
    initial: string;
    accent_color: string;
  };
  is_verified_account: boolean;
  profile_url: string;
}

interface CashAppProfileCardProps {
  profile: CashAppProfile;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const CashAppProfileCard: React.FC<CashAppProfileCardProps> = ({
  profile,
  isSelected = true,
  onSelect,
}) => {
  const [imgError, setImgError] = useState(false);
  const [copiedField, setCopiedField] = useState<'name' | 'cashtag' | null>(null);

  const handleCopy = (text: string, field: 'name' | 'cashtag', e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playKeypadTap();
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField((current) => (current === field ? null : current));
    }, 2000);
  };

  const hasPhoto = Boolean(profile.avatar.image_url) && !imgError;
  const initial = profile.avatar.initial || profile.display_name.slice(0, 1).toUpperCase();
  const accentColor = profile.avatar.accent_color || '#00D632';

  return (
    <div
      onClick={onSelect}
      className={`mx-4 my-3 p-4 rounded-2xl border transition-all cursor-pointer select-none relative shadow-xs ${
        isSelected
          ? 'border-[#00D632] bg-emerald-50/40 ring-2 ring-emerald-500/20'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {/* Top row: Avatar + Name + Cashtag + Selection Indicator */}
      <div className="flex items-start justify-between gap-3.5">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Profile Picture or Monogram Avatar */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-sm border-2 border-white ring-1 ring-gray-100 flex items-center justify-center">
            {hasPhoto ? (
              <img
                src={profile.avatar.image_url!}
                alt={profile.display_name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                style={{ backgroundColor: accentColor }}
                className="w-full h-full flex items-center justify-center text-white font-extrabold text-xl"
              >
                {initial}
              </div>
            )}
          </div>

          {/* Name & Cashtag */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-extrabold text-gray-900 text-base leading-tight truncate">
                {profile.display_name}
              </h4>
              {profile.is_verified_account && (
                <CashAppVerifiedBadge className="w-4 h-4 shadow-xs" title="Verified Cash App Account" />
              )}
            </div>

            <p className="text-sm font-semibold text-emerald-600 tracking-tight mt-0.5">
              {profile.formatted_cashtag}
            </p>

            {profile.is_verified_account && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#3399FF] mt-0.5">
                <CashAppVerifiedBadge className="w-3 h-3" />
                <span>Verified Account</span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Checkmark Badge */}
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-[#00D632] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Action Buttons: Copy Name, Copy Cashtag, Open on Cash App */}
      <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
        {/* Copy Name */}
        <button
          type="button"
          onClick={(e) => handleCopy(profile.display_name, 'name', e)}
          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors active:scale-95"
        >
          {copiedField === 'name' ? (
            <>
              <Check className="w-3 h-3 text-[#00D632]" />
              <span className="text-[#00D632]">Copied Name!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-gray-500" />
              <span>Copy Name</span>
            </>
          )}
        </button>

        {/* Copy Cashtag */}
        <button
          type="button"
          onClick={(e) => handleCopy(profile.formatted_cashtag, 'cashtag', e)}
          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors active:scale-95"
        >
          {copiedField === 'cashtag' ? (
            <>
              <Check className="w-3 h-3 text-[#00D632]" />
              <span className="text-[#00D632]">Copied Cashtag!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-gray-500" />
              <span>Copy Cashtag</span>
            </>
          )}
        </button>

        {/* Open on Cash App */}
        <a
          href={profile.profile_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="ml-auto px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-colors active:scale-95 shadow-xs"
        >
          <span>Open on cash.app</span>
          <ExternalLink className="w-3 h-3 stroke-[2.5]" />
        </a>
      </div>
    </div>
  );
};
