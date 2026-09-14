export type TabType = 'banking' | 'card' | 'keypad' | 'invest' | 'activity';

export interface Recipient {
  id: string;
  name: string;
  cashtag: string;
  avatarUrl?: string;
  avatarBg?: string;
  initials?: string;
  verified?: boolean;
}

export interface Transaction {
  id: string;
  recipientName: string;
  cashtag: string;
  amount: number;
  note?: string;
  date: string;
  timestamp: number;
  type: 'sent' | 'received' | 'add_cash';
  status: 'Completed' | 'Pending';
  avatarUrl?: string;
  avatarBg?: string;
  initials?: string;
  verified?: boolean;
}

export interface UserProfile {
  name: string;
  cashtag: string;
  balance: number;
  avatarUrl: string;
  bankName: string;
  accountNumberLast4: string;
}
