import React, { useState } from 'react';
import { Plus, ArrowDownRight, Building2, ShieldCheck, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../lib/audio';

interface BankingScreenProps {
  userProfile: UserProfile;
  onAddCash: (amount: number) => void;
}

export const BankingScreen: React.FC<BankingScreenProps> = ({
  userProfile,
  onAddCash,
}) => {
  const [showAddCashModal, setShowAddCashModal] = useState(false);
  const [addAmount, setAddAmount] = useState('50');

  const handleConfirmAdd = () => {
    const val = parseFloat(addAmount) || 50;
    setShowAddCashModal(false);
    onAddCash(val);
  };

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 select-none overflow-y-auto font-sans p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-black text-gray-900">Money</h1>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
          US
        </div>
      </div>

      {/* Main Cash Balance Card */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden my-2">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#00D632]/20 rounded-full blur-2xl pointer-events-none" />

        <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">Cash Balance</p>
        <h2 className="text-4xl font-extrabold tracking-tight text-white mb-6">
          ${userProfile.balance.toFixed(2)}
        </h2>

        {/* Add Cash & Cash Out Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playKeypadTap();
              setShowAddCashModal(true);
            }}
            className="flex-1 py-3 px-4 rounded-full bg-[#00D632] hover:bg-[#00C244] text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Cash</span>
          </button>

          <button
            onClick={() => {
              sounds.playKeypadTap();
            }}
            className="flex-1 py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <ArrowDownRight className="w-4 h-4 stroke-[3]" />
            <span>Cash Out</span>
          </button>
        </div>
      </div>

      {/* Direct Deposit & Account Details Section */}
      <div className="mt-6 space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Account Info</p>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{userProfile.bankName}</p>
              <p className="text-xs text-gray-500">Account ending in •••• {userProfile.accountNumberLast4}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Direct Deposit</p>
              <p className="text-xs text-gray-500">Routing: 021000021</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Add Cash Quick Modal */}
      {showAddCashModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl text-center">
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Add Cash</h3>
            <p className="text-xs text-gray-500 mb-4">Select or type an amount to deposit instantly</p>

            <div className="flex items-center justify-center gap-2 mb-4">
              {['25', '50', '100'].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAddAmount(amt)}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                    addAmount === amt
                      ? 'bg-[#00D632] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-lg text-gray-400">$</span>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-xl text-gray-900 text-center focus:outline-none focus:border-[#00D632]"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddCashModal(false)}
                className="flex-1 py-3 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-sm text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdd}
                className="flex-1 py-3 rounded-full bg-[#00D632] hover:bg-[#00C244] font-bold text-sm text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
