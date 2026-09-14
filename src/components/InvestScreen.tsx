import React, { useState } from 'react';
import { Search, TrendingUp, Bitcoin } from 'lucide-react';
import { sounds } from '../lib/audio';

export const InvestScreen: React.FC = () => {
  const [mode, setMode] = useState<'stocks' | 'bitcoin'>('stocks');

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 select-none overflow-y-auto font-sans p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-2xl font-black text-gray-900">Investing</h1>
        <div className="flex bg-gray-100 p-1 rounded-full">
          <button
            onClick={() => {
              sounds.playKeypadTap();
              setMode('stocks');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              mode === 'stocks' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => {
              sounds.playKeypadTap();
              setMode('bitcoin');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              mode === 'bitcoin' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500'
            }`}
          >
            Bitcoin
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative my-3">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search stocks or bitcoin"
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-2xl text-sm font-medium focus:outline-none"
        />
      </div>

      {/* Featured Market Section */}
      <div className="bg-zinc-900 text-white rounded-3xl p-5 my-3 shadow-lg relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">
              {mode === 'stocks' ? 'S&P 500 Index' : 'Bitcoin Price'}
            </span>
            <h2 className="text-3xl font-black text-white mt-0.5">
              {mode === 'stocks' ? '$5,420.15' : '$64,850.00'}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800/40">
            <TrendingUp className="w-4 h-4" />
            <span>+2.45%</span>
          </div>
        </div>

        {/* Mini Wave SVG Chart */}
        <div className="h-20 mt-4">
          <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
            <path
              d="M0 60 Q 50 20, 100 40 T 200 10 T 300 30"
              fill="none"
              stroke="#00D632"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>

      {/* Top Movers List */}
      <div className="mt-4 space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Movers</p>

        {[
          { name: 'Apple Inc.', symbol: 'AAPL', price: '$224.23', change: '+1.8%' },
          { name: 'Tesla Inc.', symbol: 'TSLA', price: '$210.50', change: '+4.2%' },
          { name: 'NVIDIA Corp.', symbol: 'NVDA', price: '$128.90', change: '+3.1%' },
        ].map((item) => (
          <div
            key={item.symbol}
            className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-xs">
                {item.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">{item.symbol}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{item.price}</p>
              <p className="text-xs font-bold text-emerald-600">{item.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
