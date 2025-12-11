/**
 * Type definitions for Web5 OmniNeoBanking features
 */

export interface VirtualCard {
  id: string;
  type: 'debit' | 'credit';
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  balance: number;
  creditLimit?: number;
  status: 'active' | 'frozen' | 'cancelled';
  createdAt: string;
  provider: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'transfer' | 'refund';
  amount: number;
  currency: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  from?: string;
  to?: string;
  cardId?: string;
  metadata?: Record<string, any>;
}

export interface BankAccount {
  accountNumber: string;
  accountType: 'checking' | 'savings';
  balance: number;
  currency: string;
  did: string; // Decentralized Identifier
  createdAt: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  recipient: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface AIPaymentAgent {
  enabled: boolean;
  autoApprove: boolean;
  maxAmount: number;
  allowedCategories: string[];
  lastActivity: string;
}

export interface NeoBankingState {
  account: BankAccount | null;
  cards: VirtualCard[];
  transactions: Transaction[];
  aiAgent: AIPaymentAgent;
  isLoading: boolean;
  error: string | null;
}

export interface CardIssuanceRequest {
  type: 'debit' | 'credit';
  cardholderName: string;
  creditLimit?: number;
}
