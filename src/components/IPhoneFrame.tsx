import React from 'react';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center font-sans select-none antialiased">
      {/* Clean Standalone App Container */}
      <div className="w-full max-w-md h-screen sm:h-[840px] sm:max-h-[92vh] sm:rounded-3xl bg-black overflow-hidden relative shadow-2xl border-0 sm:border sm:border-zinc-800 flex flex-col">
        {children}
      </div>
    </div>
  );
};

