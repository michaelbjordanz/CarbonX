/**
 * Web5 OmniNeoBanking Service
 * Handles all neobanking operations including card issuing, payments, and AI agent
 */

import { initializeWeb5, getWeb5Instance, getUserDid } from './web5-config';
import type {
  VirtualCard,
  Transaction,
  BankAccount,
  CardIssuanceRequest,
  PaymentRequest,
  AIPaymentAgent,
} from '../types/neobanking';

// Protocol definition for banking records
const BANKING_PROTOCOL = {
  protocol: 'https://carbonx.app/neobanking',
  published: true,
  types: {
    account: {
      schema: 'https://carbonx.app/schemas/bankAccount',
      dataFormats: ['application/json'],
    },
    card: {
      schema: 'https://carbonx.app/schemas/virtualCard',
      dataFormats: ['application/json'],
    },
    transaction: {
      schema: 'https://carbonx.app/schemas/transaction',
      dataFormats: ['application/json'],
    },
  },
  structure: {
    account: {},
    card: {},
    transaction: {},
  },
};

/**
 * Initialize banking account with Web5
 */
export async function initializeBankingAccount(): Promise<BankAccount> {
  const { web5, did } = await initializeWeb5();

  // Check if account already exists
  const existingAccount = await loadBankAccount();
  if (existingAccount) {
    return existingAccount;
  }

  // Create new bank account
  const account: BankAccount = {
    accountNumber: generateAccountNumber(),
    accountType: 'checking',
    balance: 1000, // Starting balance for demo
    currency: 'USD',
    did,
    createdAt: new Date().toISOString(),
  };

  // Store account in DWN (Decentralized Web Node)
  try {
    const { record } = await web5.dwn.records.create({
      data: account,
      message: {
        protocol: BANKING_PROTOCOL.protocol,
        protocolPath: 'account',
        schema: BANKING_PROTOCOL.types.account.schema,
        dataFormat: 'application/json',
      },
    });

    await record?.send(did);
    return account;
  } catch (error) {
    console.error('Failed to create bank account:', error);
    // Fallback to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('neobank_account', JSON.stringify(account));
    }
    return account;
  }
}

/**
 * Load existing bank account
 */
export async function loadBankAccount(): Promise<BankAccount | null> {
  try {
    const web5 = getWeb5Instance();
    const did = getUserDid();

    if (!web5 || !did) {
      // Try local storage fallback
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('neobank_account');
        return stored ? JSON.parse(stored) : null;
      }
      return null;
    }

    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: BANKING_PROTOCOL.protocol,
          protocolPath: 'account',
        },
      },
    });

    if (records && records.length > 0) {
      const data = await records[0].data.json();
      return data as BankAccount;
    }

    return null;
  } catch (error) {
    console.error('Failed to load bank account:', error);
    return null;
  }
}

/**
 * Issue a new virtual card
 */
export async function issueVirtualCard(
  request: CardIssuanceRequest
): Promise<VirtualCard> {
  const did = getUserDid();
  if (!did) {
    throw new Error('Web5 not initialized');
  }

  const card: VirtualCard = {
    id: generateCardId(),
    type: request.type,
    cardNumber: generateCardNumber(),
    cardholderName: request.cardholderName,
    expiryDate: generateExpiryDate(),
    cvv: generateCVV(),
    balance: request.type === 'debit' ? 0 : (request.creditLimit || 5000),
    creditLimit: request.type === 'credit' ? request.creditLimit : undefined,
    status: 'active',
    createdAt: new Date().toISOString(),
    provider: 'CarbonX NeoBanking',
  };

  // Store in DWN or fallback to local storage
  try {
    const web5 = getWeb5Instance();
    if (web5) {
      const { record } = await web5.dwn.records.create({
        data: card,
        message: {
          protocol: BANKING_PROTOCOL.protocol,
          protocolPath: 'card',
          schema: BANKING_PROTOCOL.types.card.schema,
          dataFormat: 'application/json',
        },
      });
      await record?.send(did);
    }
  } catch (error) {
    console.error('Failed to store card in DWN:', error);
  }

  // Always store in local storage as fallback
  if (typeof window !== 'undefined') {
    const cards = loadCardsFromStorage();
    cards.push(card);
    localStorage.setItem('neobank_cards', JSON.stringify(cards));
  }

  return card;
}

/**
 * Load all virtual cards
 */
export async function loadVirtualCards(): Promise<VirtualCard[]> {
  if (typeof window === 'undefined') return [];

  // For demo, use local storage
  return loadCardsFromStorage();
}

/**
 * Process payment with AI agent
 */
export async function processPayment(
  payment: PaymentRequest,
  aiAgent: AIPaymentAgent
): Promise<Transaction> {
  const did = getUserDid();
  if (!did) {
    throw new Error('Web5 not initialized');
  }

  // AI agent validation
  if (aiAgent.enabled) {
    if (payment.amount > aiAgent.maxAmount && !aiAgent.autoApprove) {
      throw new Error('Payment exceeds AI agent approval limit');
    }
  }

  const transaction: Transaction = {
    id: generateTransactionId(),
    type: 'payment',
    amount: payment.amount,
    currency: payment.currency,
    description: payment.description,
    timestamp: new Date().toISOString(),
    status: 'completed',
    from: did,
    to: payment.recipient,
    metadata: payment.metadata,
  };

  // Store transaction
  if (typeof window !== 'undefined') {
    const transactions = loadTransactionsFromStorage();
    transactions.push(transaction);
    localStorage.setItem('neobank_transactions', JSON.stringify(transactions));
  }

  return transaction;
}

/**
 * Load transaction history
 */
export async function loadTransactions(): Promise<Transaction[]> {
  if (typeof window === 'undefined') return [];
  return loadTransactionsFromStorage();
}

/**
 * Deposit funds
 */
export async function depositFunds(amount: number, source: string): Promise<Transaction> {
  const did = getUserDid();
  if (!did) {
    throw new Error('Web5 not initialized');
  }

  const transaction: Transaction = {
    id: generateTransactionId(),
    type: 'deposit',
    amount,
    currency: 'USD',
    description: `Deposit from ${source}`,
    timestamp: new Date().toISOString(),
    status: 'completed',
    to: did,
    from: source,
  };

  if (typeof window !== 'undefined') {
    const transactions = loadTransactionsFromStorage();
    transactions.push(transaction);
    localStorage.setItem('neobank_transactions', JSON.stringify(transactions));

    // Update account balance
    const account = await loadBankAccount();
    if (account) {
      account.balance += amount;
      localStorage.setItem('neobank_account', JSON.stringify(account));
    }
  }

  return transaction;
}

/**
 * Withdraw funds
 */
export async function withdrawFunds(amount: number, destination: string): Promise<Transaction> {
  const did = getUserDid();
  if (!did) {
    throw new Error('Web5 not initialized');
  }

  const account = await loadBankAccount();
  if (!account || account.balance < amount) {
    throw new Error('Insufficient funds');
  }

  const transaction: Transaction = {
    id: generateTransactionId(),
    type: 'withdrawal',
    amount,
    currency: 'USD',
    description: `Withdrawal to ${destination}`,
    timestamp: new Date().toISOString(),
    status: 'completed',
    from: did,
    to: destination,
  };

  if (typeof window !== 'undefined') {
    const transactions = loadTransactionsFromStorage();
    transactions.push(transaction);
    localStorage.setItem('neobank_transactions', JSON.stringify(transactions));

    // Update account balance
    account.balance -= amount;
    localStorage.setItem('neobank_account', JSON.stringify(account));
  }

  return transaction;
}

// Helper functions
function generateAccountNumber(): string {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
}

function generateCardNumber(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
}

function generateCardId(): string {
  return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateCVV(): string {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
}

function generateExpiryDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function loadCardsFromStorage(): VirtualCard[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('neobank_cards');
  return stored ? JSON.parse(stored) : [];
}

function loadTransactionsFromStorage(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('neobank_transactions');
  return stored ? JSON.parse(stored) : [];
}
