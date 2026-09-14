import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronDown,
  Check,
  UserPlus,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Recipient, UserProfile } from '../types';
import { SUGGESTED_RECIPIENTS } from '../data/mockData';
import { sounds } from '../lib/audio';
import { handleAvatarImgError } from '../lib/avatar';
import { CashAppProfileCard, CashAppProfile } from './CashAppProfileCard';
import { CashAppVerifiedBadge } from './CashAppVerifiedBadge';
import { TopFaceIdVerification } from './TopFaceIdVerification';

interface SendPaymentScreenProps {
  amount: number;
  onClose: () => void;
  onSendPayment: (recipient: Recipient, note: string) => void;
  userProfile: UserProfile;
}

export interface RealExampleRecipient extends Recipient {
  subtitle?: string;
  category?: string;
}

// Real Cash App profile examples shown line by line
export const REAL_EXAMPLE_PROFILES: RealExampleRecipient[] = [
  {
    id: 'ex-unicef',
    name: 'U.S. Fund For UNICEF',
    cashtag: '$UNICEF',
    avatarUrl: 'https://franklin-assets.s3.amazonaws.com/apps/imgs/JWD4UQOny9PsrE9LeUMR9F.jpeg',
    avatarBg: 'bg-[#41EBC1]',
    initials: 'U',
    verified: true,
    subtitle: 'Verified Nonprofit • Humanitarian Relief',
  },
  {
    id: 'ex-wikipedia',
    name: 'Wikimedia Foundation',
    cashtag: '$wikipedia',
    avatarUrl: 'https://franklin-assets.s3.amazonaws.com/apps/imgs/SX4xKaeBJKExCcT2srAqdD.jpeg',
    avatarBg: 'bg-zinc-800',
    initials: 'W',
    verified: true,
    subtitle: 'Verified Nonprofit • Free Knowledge & Wikipedia',
  },
  {
    id: 'ex-sarah',
    name: 'Sarah Hirsch',
    cashtag: '$sarah',
    avatarUrl: 'https://franklin-assets.s3.amazonaws.com/apps/imgs/3has0AjU7ARHU2PICsitID.jpeg',
    avatarBg: 'bg-pink-600',
    initials: 'S',
    verified: false,
    subtitle: 'Active Cash App user',
  },
  {
    id: 'ex-mike',
    name: 'Mike Brock',
    cashtag: '$mike',
    avatarUrl: 'https://franklin-assets.s3.amazonaws.com/apps/imgs/28TBO62Tmv1oKd55LSmC9D.jpeg',
    avatarBg: 'bg-blue-600',
    initials: 'M',
    verified: false,
    subtitle: 'Active Cash App user',
  },
  {
    id: 'ex-elizabeth',
    name: 'Beth Rabenstine',
    cashtag: '$elizabeth',
    avatarUrl: 'https://franklin-assets.s3.amazonaws.com/apps/imgs/tLXObwRsHVNjwgtkONjV.jpeg',
    avatarBg: 'bg-purple-600',
    initials: 'E',
    verified: false,
    subtitle: 'Active Cash App user',
  },
  {
    id: 'ex-sc',
    name: 'Jay Z',
    cashtag: '$sc',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    avatarBg: 'bg-zinc-800',
    initials: 'J',
    verified: true,
    subtitle: 'Verified Artist',
  },
];

/**
 * Automatically cleans cashtag inputs by removing $, @, and full URL prefixes
 */
export function cleanCashtagInput(input: string): string {
  let cleaned = (input || '').trim();
  // Strip url prefixes (e.g., https://cash.app/$ or cash.app/$)
  cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?cash\.app\/(\$|%24)?/i, '');
  // Strip leading $ or @
  cleaned = cleaned.replace(/^[\$@]+/, '');
  // Strip query parameters or trailing slashes
  cleaned = cleaned.split('/')[0].split('?')[0].trim();
  return cleaned;
}

export const SendPaymentScreen: React.FC<SendPaymentScreenProps> = ({
  amount,
  onClose,
  onSendPayment,
  userProfile,
}) => {
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [customInput, setCustomInput] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [sendAsMode, setSendAsMode] = useState<'cash' | 'giftcard' | 'stock'>('cash');
  const [bankSource, setBankSource] = useState<string>(userProfile.bankName);
  const [isBankPickerOpen, setIsBankPickerOpen] = useState(false);
  const [isFaceIdActive, setIsFaceIdActive] = useState(false);

  // Cash App real profile lookup state
  const [profileData, setProfileData] = useState<CashAppProfile | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const cleanInputTag = cleanCashtagInput(customInput);

  // Debounced profile lookup from Express backend /api/cashapp-profile
  useEffect(() => {
    if (!cleanInputTag || cleanInputTag.length < 2) {
      setProfileData(null);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/cashapp-profile?tag=${encodeURIComponent(cleanInputTag)}`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (response.ok && data.found) {
          setProfileData(data);
          setSearchError(null);
        } else {
          setProfileData(null);
          setSearchError(data.error || `No Cash App profile found for $${cleanInputTag}`);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setProfileData(null);
          setSearchError(`Could not find Cash App profile for $${cleanInputTag}`);
        }
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cleanInputTag]);

  // Filter suggested contacts (local list)
  const filteredRecipients = cleanInputTag
    ? SUGGESTED_RECIPIENTS.filter(
        (r) =>
          r.name.toLowerCase().includes(cleanInputTag.toLowerCase()) ||
          r.cashtag.toLowerCase().includes(cleanInputTag.toLowerCase())
      )
    : [];

  // Determine active recipient for payment
  const activeRecipient: Recipient | null =
    selectedRecipient ||
    (profileData && profileData.found
      ? {
          id: `profile-${profileData.clean_cashtag}`,
          name: profileData.display_name,
          cashtag: profileData.formatted_cashtag,
          avatarUrl: profileData.avatar.image_url || undefined,
          avatarBg: profileData.avatar.accent_color,
          initials: profileData.avatar.initial,
          verified: profileData.is_verified_account,
        }
      : cleanInputTag
      ? {
          id: 'custom-' + cleanInputTag,
          name: `$${cleanInputTag}`,
          cashtag: `$${cleanInputTag}`,
          avatarUrl: undefined,
          avatarBg: 'bg-emerald-600',
          initials: cleanInputTag.slice(0, 1).toUpperCase(),
        }
      : null);

  const canPay = Boolean(activeRecipient);

  // Trigger top Face ID verification before continuing to page 3
  const handlePayClick = () => {
    if (!canPay || !activeRecipient) return;
    sounds.playKeypadTap();
    setIsFaceIdActive(true);
  };

  // Called when 2-second top Face ID verification completes
  const handleFaceIdComplete = () => {
    setIsFaceIdActive(false);
    if (activeRecipient) {
      onSendPayment(activeRecipient, note);
    }
  };

  const handleSelectExample = (example: RealExampleRecipient) => {
    sounds.playKeypadTap();
    setSelectedRecipient(example);
    setCustomInput(example.cashtag);
    setProfileData(null);
  };

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 select-none overflow-hidden relative font-sans">
      {/* Top Face ID Verification Prompt (iPhone style Dynamic Island alert at top of screen for 2s) */}
      <TopFaceIdVerification
        isOpen={isFaceIdActive}
        amount={amount}
        recipientName={activeRecipient?.name || 'Contact'}
        recipientAvatar={activeRecipient?.avatarUrl}
        onComplete={handleFaceIdComplete}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button
          onClick={() => {
            sounds.playKeypadTap();
            onClose();
          }}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <X className="w-6 h-6 stroke-[2]" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            ${amount > 0 ? amount.toFixed(amount % 1 === 0 ? 0 : 2) : '0'}
          </span>
          <button
            onClick={() => setIsBankPickerOpen(!isBankPickerOpen)}
            className="flex items-center gap-0.5 text-xs text-gray-500 font-medium hover:text-gray-800 transition-colors"
          >
            <span>{bankSource}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </div>

        <button
          onClick={handlePayClick}
          disabled={!canPay || isFaceIdActive}
          className={`px-5 py-1.5 rounded-full font-bold text-sm transition-all ${
            canPay && !isFaceIdActive
              ? 'bg-[#00D632] hover:bg-[#00C244] text-white shadow-sm active:scale-95 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isFaceIdActive ? 'Verifying...' : 'Pay'}
        </button>
      </div>

      {/* Bank Picker Dropdown Modal */}
      {isBankPickerOpen && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-white border border-gray-200 rounded-2xl shadow-xl p-2 w-64 text-sm">
          <p className="text-xs font-semibold text-gray-400 px-3 py-1 uppercase">Funding Source</p>
          <button
            onClick={() => {
              setBankSource('Bank of America');
              setIsBankPickerOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 font-medium flex items-center justify-between"
          >
            <span>Bank of America (...8821)</span>
            {bankSource === 'Bank of America' && <Check className="w-4 h-4 text-emerald-600" />}
          </button>
          <button
            onClick={() => {
              setBankSource('Cash Balance');
              setIsBankPickerOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 font-medium flex items-center justify-between"
          >
            <span>Cash Balance (${userProfile.balance.toFixed(2)})</span>
            {bankSource === 'Cash Balance' && <Check className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      )}

      {/* Input Rows */}
      <div className="flex flex-col border-b border-gray-100">
        {/* "To" Input Row */}
        <div className="flex items-center px-5 py-3.5 border-b border-gray-100">
          <span className="text-gray-800 font-semibold text-base w-10">To</span>
          <div className="relative flex-1 flex items-center">
            {/* Green Cursor Indicator */}
            <div className="w-0.5 h-5 bg-[#00D632] mr-2 animate-pulse rounded-full" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (selectedRecipient) setSelectedRecipient(null);
              }}
              placeholder="Name, $Cashtag, or cash.app link"
              className="w-full bg-transparent text-gray-900 text-base font-medium focus:outline-none placeholder:text-gray-300"
            />
            {customInput && (
              <button
                onClick={() => {
                  setCustomInput('');
                  setSelectedRecipient(null);
                  setProfileData(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* "For" Input Row */}
        <div className="flex items-center px-5 py-3.5 border-b border-gray-100">
          <span className="text-gray-800 font-semibold text-base w-10">For</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note"
            className="w-full bg-transparent text-gray-900 text-base font-medium focus:outline-none placeholder:text-gray-300"
          />
        </div>

        {/* "Send as" Selector */}
        <div className="flex items-center px-5 py-2.5 gap-2 overflow-x-auto no-scrollbar">
          <span className="text-gray-800 font-semibold text-xs mr-1 whitespace-nowrap">Send as</span>

          <button
            onClick={() => {
              sounds.playKeypadTap();
              setSendAsMode('cash');
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
              sendAsMode === 'cash'
                ? 'bg-[#00D632] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cash
          </button>

          <button
            onClick={() => {
              sounds.playKeypadTap();
              setSendAsMode('giftcard');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
              sendAsMode === 'giftcard'
                ? 'bg-[#00D632] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>Gift Card</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          <button
            onClick={() => {
              sounds.playKeypadTap();
              setSendAsMode('stock');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
              sendAsMode === 'stock'
                ? 'bg-[#00D632] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>Stock</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
        </div>
      </div>

      {/* Main Content Area: Examples by lines and Real Profiles */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading State for Search */}
        {isSearching && (
          <div className="mx-4 my-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center gap-2.5 text-gray-500">
            <Loader2 className="w-4 h-4 text-[#00D632] animate-spin stroke-[2.5]" />
            <span className="text-xs font-bold">
              Looking up ${cleanInputTag} on Cash App...
            </span>
          </div>
        )}

        {/* Real Profile Card for Live Search */}
        {profileData && (
          <div>
            <div className="px-5 pt-3 pb-1">
              <span className="text-[11px] font-extrabold text-emerald-600 tracking-wider uppercase">
                REAL CASH APP PROFILE FOUND
              </span>
            </div>
            <CashAppProfileCard
              profile={profileData}
              isSelected={!selectedRecipient || selectedRecipient.id === `profile-${profileData.clean_cashtag}`}
              onSelect={() => {
                sounds.playKeypadTap();
                setSelectedRecipient({
                  id: `profile-${profileData.clean_cashtag}`,
                  name: profileData.display_name,
                  cashtag: profileData.formatted_cashtag,
                  avatarUrl: profileData.avatar.image_url || undefined,
                  avatarBg: profileData.avatar.accent_color,
                  initials: profileData.avatar.initial,
                  verified: profileData.is_verified_account,
                });
              }}
            />
          </div>
        )}

        {/* Search Error State */}
        {!isSearching && !profileData && searchError && (
          <div className="mx-4 my-3 p-3.5 rounded-2xl border border-amber-200/80 bg-amber-50/60 text-xs text-amber-800">
            <p className="font-bold">{searchError}</p>
            <p className="text-[11px] text-amber-700/80 mt-0.5">
              You can tap an example profile below or tap Pay to send directly to ${cleanInputTag}.
            </p>
          </div>
        )}

        {/* Matching Filtered Contacts from user contacts */}
        {filteredRecipients.length > 0 && (
          <>
            <div className="px-5 pt-3 pb-2 bg-gray-50/80 border-b border-gray-100">
              <span className="text-[11px] font-extrabold text-gray-400 tracking-wider uppercase">
                FREQUENT CONTACTS
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredRecipients.map((rec) => {
                const isSelected = selectedRecipient?.id === rec.id;

                return (
                  <div
                    key={rec.id}
                    onClick={() => {
                      sounds.playKeypadTap();
                      setSelectedRecipient(rec);
                    }}
                    className={`flex items-center justify-between px-5 py-3 hover:bg-gray-50/80 cursor-pointer transition-colors ${
                      isSelected ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-[#00D632] text-white border border-[#00D632]'
                            : 'border border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        <span>{rec.initials || rec.name.slice(0, 1)}</span>
                        {rec.avatarUrl && (
                          <img
                            src={rec.avatarUrl}
                            alt={rec.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover absolute inset-0"
                            onError={(e) => handleAvatarImgError(e, rec.cashtag || rec.name)}
                          />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-900 text-sm">{rec.name}</p>
                          {rec.verified && <CashAppVerifiedBadge className="w-3.5 h-3.5" />}
                        </div>
                        <p className="text-xs font-medium text-gray-400">{rec.cashtag}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Add contact"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Examples Shown by Lines with Real Profiles */}
        <div className="mt-1">
          <div className="px-5 pt-3.5 pb-2 bg-gray-50/90 border-t border-b border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-gray-500 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              EXAMPLE PROFILES
            </span>
            <span className="text-[11px] font-semibold text-gray-400">
              Tap line to select
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {REAL_EXAMPLE_PROFILES.map((example) => {
              const isSelected = selectedRecipient?.id === example.id || selectedRecipient?.cashtag === example.cashtag;

              return (
                <div
                  key={example.id}
                  onClick={() => handleSelectExample(example)}
                  className={`flex items-center justify-between px-5 py-3.5 hover:bg-emerald-50/40 cursor-pointer transition-colors border-b border-gray-100 ${
                    isSelected ? 'bg-emerald-50/80' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Selection Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#00D632] text-white ring-2 ring-emerald-300'
                          : 'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    {/* Real Profile Avatar Picture */}
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-gray-200/80 shadow-xs bg-zinc-100">
                      <img
                        src={example.avatarUrl}
                        alt={example.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => handleAvatarImgError(e, example.cashtag || example.name)}
                      />
                    </div>

                    {/* Name, Verified Badge & Cashtag */}
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-gray-900 text-sm truncate">{example.name}</p>
                        {example.verified && <CashAppVerifiedBadge className="w-4 h-4 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-[#00D632]">{example.cashtag}</span>
                        {example.subtitle && (
                          <span className="text-[11px] text-gray-400 font-medium truncate">
                            • {example.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action Button */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectExample(example);
                      }}
                      className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                        isSelected
                          ? 'bg-[#00D632] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
