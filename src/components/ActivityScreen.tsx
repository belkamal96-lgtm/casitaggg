import React from 'react';
import { Transaction } from '../types';
import { getRealAvatarUrl, handleAvatarImgError } from '../lib/avatar';
import { CashAppVerifiedBadge } from './CashAppVerifiedBadge';

interface ActivityScreenProps {
  transactions: Transaction[];
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ transactions }) => {
  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 select-none overflow-y-auto font-sans p-5">
      {/* Top Header */}
      <div className="pb-3 border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900">Activity</h1>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-gray-100 mt-2">
        {transactions.map((tx) => {
          const isSent = tx.type === 'sent';
          const isAdd = tx.type === 'add_cash';
          const avatarUrl = isAdd ? undefined : getRealAvatarUrl(tx.cashtag || tx.recipientName, tx.avatarUrl);

          return (
            <div key={tx.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* Avatar */}
                <div
                  className={`relative w-11 h-11 rounded-full overflow-hidden ${tx.avatarBg || 'bg-purple-600'} text-white font-bold flex items-center justify-center text-base shadow-sm`}
                >
                  <span>{tx.initials || tx.recipientName.slice(0, 1)}</span>
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt={tx.recipientName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover absolute inset-0 rounded-full"
                      onError={(e) => handleAvatarImgError(e, tx.cashtag || tx.recipientName)}
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-gray-900 text-sm">{tx.recipientName}</p>
                    {tx.verified && <CashAppVerifiedBadge className="w-3.5 h-3.5" />}
                  </div>
                  <p className="text-xs text-gray-500">
                    {tx.note || (isAdd ? 'Deposit' : tx.cashtag)} • {tx.date}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p
                  className={`font-extrabold text-sm ${
                    isSent ? 'text-gray-900' : 'text-[#00D632]'
                  }`}
                >
                  {isSent ? `-$${tx.amount.toFixed(2)}` : `+$${tx.amount.toFixed(2)}`}
                </p>
                <p className="text-[11px] font-semibold text-emerald-600">{tx.status}</p>
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <p>No activity yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
