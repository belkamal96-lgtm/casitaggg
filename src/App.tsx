import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TabType, Recipient, Transaction, UserProfile } from './types';
import { INITIAL_USER_PROFILE, INITIAL_TRANSACTIONS } from './data/mockData';
import { IPhoneFrame } from './components/IPhoneFrame';
import { KeypadScreen } from './components/KeypadScreen';
import { SendPaymentScreen } from './components/SendPaymentScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { BankingScreen } from './components/BankingScreen';
import { CashCardScreen } from './components/CashCardScreen';
import { ActivityScreen } from './components/ActivityScreen';
import { InvestScreen } from './components/InvestScreen';
import { ProfileModal } from './components/ProfileModal';
import { QrModal } from './components/QrModal';
import { sounds } from './lib/audio';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('keypad');
  const [screenStep, setScreenStep] = useState<'keypad' | 'send' | 'success'>('keypad');

  // Transaction State
  const [amountStr, setAmountStr] = useState<string>('0');
  const [activeRecipient, setActiveRecipient] = useState<Recipient | null>(null);
  const [activeNote, setActiveNote] = useState<string>('');
  const [successType, setSuccessType] = useState<'sent' | 'add_cash'>('sent');

  // Modals State
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isQrOpen, setIsQrOpen] = useState<boolean>(false);

  // User Profile & Activity Data
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const numericAmount = parseFloat(amountStr) || 0;

  // Step 1 -> Step 2: Keypad Pay Click
  const handleKeypadPay = () => {
    setScreenStep('send');
  };

  // Step 1: Request Click
  const handleKeypadRequest = () => {
    alert(`Requested $${numericAmount}! (Request simulation)`);
  };

  // Step 2 -> Send Payment directly to Step 3: Success Screen
  const handleSendPayment = (recipient: Recipient, note: string) => {
    setActiveRecipient(recipient);
    setActiveNote(note);
    sounds.playPaymentSuccess();

    // Deduct balance and record transaction
    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      recipientName: recipient.name,
      cashtag: recipient.cashtag,
      amount: numericAmount,
      note: note || 'Cash App payment',
      date: 'Just now',
      timestamp: Date.now(),
      type: 'sent',
      status: 'Completed',
      avatarUrl: recipient.avatarUrl,
      avatarBg: recipient.avatarBg,
      initials: recipient.initials,
      verified: recipient.verified,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - numericAmount),
    }));

    setSuccessType('sent');
    setScreenStep('success');
  };

  // Add Cash from Banking tab -> Step 3 Success Screen
  const handleAddCash = (amount: number) => {
    sounds.playPaymentSuccess();

    const newTx: Transaction = {
      id: 'tx-' + Date.now(),
      recipientName: 'Cash Deposit',
      cashtag: userProfile.bankName,
      amount,
      note: 'Added to Cash App',
      date: 'Just now',
      timestamp: Date.now(),
      type: 'add_cash',
      status: 'Completed',
      avatarBg: 'bg-emerald-600',
      initials: '$',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      balance: prev.balance + amount,
    }));

    setAmountStr(amount.toString());
    setSuccessType('add_cash');
    setScreenStep('success');
  };

  // Step 3 -> Step 1: Done button click
  const handleSuccessDone = () => {
    setAmountStr('0');
    setActiveRecipient(null);
    setActiveNote('');
    setScreenStep('keypad');
    setActiveTab('keypad');
  };

  return (
    <IPhoneFrame>
      <div className="w-full h-full relative overflow-hidden bg-black font-sans">
        {/* Base Layer: Keypad and Main Tabs (Always mounted for seamless transition) */}
        <div className="w-full h-full flex flex-col">
          {activeTab === 'keypad' && (
            <KeypadScreen
              amountStr={amountStr}
              setAmountStr={setAmountStr}
              onPayClick={handleKeypadPay}
              onRequestClick={handleKeypadRequest}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userProfile={userProfile}
              onOpenProfile={() => setIsProfileOpen(true)}
              onOpenQr={() => setIsQrOpen(true)}
            />
          )}

          {activeTab === 'banking' && (
            <BankingScreen userProfile={userProfile} onAddCash={handleAddCash} />
          )}

          {activeTab === 'card' && <CashCardScreen userProfile={userProfile} />}

          {activeTab === 'invest' && <InvestScreen />}

          {activeTab === 'activity' && <ActivityScreen transactions={transactions} />}
        </div>

        {/* Overlay 1: Send Payment Screen */}
        <AnimatePresence>
          {screenStep === 'send' && (
            <motion.div
              key="send-screen"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full h-full absolute inset-0 z-20 bg-white"
            >
              <SendPaymentScreen
                amount={numericAmount}
                onClose={() => setScreenStep('keypad')}
                onSendPayment={handleSendPayment}
                userProfile={userProfile}
              />
            </motion.div>
          )}

          {/* Overlay 2: Success Screen */}
          {screenStep === 'success' && (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full h-full absolute inset-0 z-30 bg-white"
            >
              <SuccessScreen
                amount={numericAmount}
                recipientName={activeRecipient?.name || 'Contact'}
                recipient={activeRecipient}
                type={successType}
                onDone={handleSuccessDone}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Drawer Modal */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userProfile={userProfile}
          onUpdateProfile={setUserProfile}
        />

        {/* QR Scanner / My Code Modal */}
        <QrModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          userProfile={userProfile}
        />
      </div>
    </IPhoneFrame>
  );
}
