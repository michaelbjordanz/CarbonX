"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Plus,
  History,
  Shield,
  Bot,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  initializeBankingAccount,
  issueVirtualCard,
  loadVirtualCards,
  loadTransactions,
  processPayment,
  depositFunds,
} from '@/lib/neobanking-service';
import { initializeWeb5 } from '@/lib/web5-config';
import type {
  VirtualCard,
  Transaction,
  BankAccount,
  AIPaymentAgent,
} from '@/types/neobanking';

export default function NeoBankingPage() {
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  
  const [aiAgent] = useState<AIPaymentAgent>({
    enabled: true,
    autoApprove: false,
    maxAmount: 1000,
    allowedCategories: ['carbon-credits', 'sustainability', 'green-energy'],
    lastActivity: new Date().toISOString(),
  });

  const [cardForm, setCardForm] = useState({
    type: 'debit' as 'debit' | 'credit',
    cardholderName: '',
    creditLimit: 5000,
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    recipient: '',
    description: '',
  });

  const [depositForm, setDepositForm] = useState({
    amount: 0,
    source: '',
  });

  useEffect(() => {
    initializeAccount();
  }, []);

  async function initializeAccount() {
    try {
      setIsLoading(true);
      setError(null);

      await initializeWeb5();
      const bankAccount = await initializeBankingAccount();
      setAccount(bankAccount);

      const [loadedCards, loadedTransactions] = await Promise.all([
        loadVirtualCards(),
        loadTransactions(),
      ]);

      setCards(loadedCards);
      setTransactions(loadedTransactions);
    } catch (err) {
      console.error('Failed to initialize account:', err);
      setError('Failed to initialize banking account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleIssueCard(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const newCard = await issueVirtualCard(cardForm);
      setCards([...cards, newCard]);
      setShowCardForm(false);
      setCardForm({ type: 'debit', cardholderName: '', creditLimit: 5000 });
    } catch (err) {
      console.error('Failed to issue card:', err);
      setError('Failed to issue virtual card');
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const transaction = await processPayment(
        {
          amount: paymentForm.amount,
          currency: 'USD',
          recipient: paymentForm.recipient,
          description: paymentForm.description,
        },
        aiAgent
      );
      setTransactions([transaction, ...transactions]);
      setShowPaymentForm(false);
      setPaymentForm({ amount: 0, recipient: '', description: '' });
      
      if (account) {
        setAccount({ ...account, balance: account.balance - paymentForm.amount });
      }
    } catch (err: any) {
      console.error('Payment failed:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const transaction = await depositFunds(depositForm.amount, depositForm.source);
      setTransactions([transaction, ...transactions]);
      setShowDepositForm(false);
      setDepositForm({ amount: 0, source: '' });
      
      if (account) {
        setAccount({ ...account, balance: account.balance + depositForm.amount });
      }
    } catch (err: any) {
      console.error('Deposit failed:', err);
      setError(err.message || 'Deposit failed');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Initializing Web5 Banking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Web5 OmniNeoBanking
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Decentralized banking powered by Web5, AI agents, and blockchain technology
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </motion.div>
        )}

        {account && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-8 h-8 text-emerald-400" />
                <h3 className="text-xl font-semibold">Account Balance</h3>
              </div>
              <p className="text-4xl font-bold text-emerald-400">
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-zinc-400 text-sm mt-2">Account #{account.accountNumber}</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-8 h-8 text-cyan-400" />
                <h3 className="text-xl font-semibold">Virtual Cards</h3>
              </div>
              <p className="text-4xl font-bold text-cyan-400">{cards.length}</p>
              <p className="text-zinc-400 text-sm mt-2">
                {cards.filter(c => c.status === 'active').length} active
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-8 h-8 text-purple-400" />
                <h3 className="text-xl font-semibold">AI Agent</h3>
              </div>
              <div className="flex items-center gap-2">
                {aiAgent.enabled ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">Active</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-zinc-400" />
                    <span className="text-zinc-400">Disabled</span>
                  </>
                )}
              </div>
              <p className="text-zinc-400 text-sm mt-2">Max: ${aiAgent.maxAmount}</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <button
            onClick={() => setShowDepositForm(true)}
            className="bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-xl p-4 transition-all flex flex-col items-center gap-2"
          >
            <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-xl p-4 transition-all flex flex-col items-center gap-2"
          >
            <Send className="w-6 h-6 text-cyan-400" />
            <span>Pay</span>
          </button>
          <button
            onClick={() => setShowCardForm(true)}
            className="bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-xl p-4 transition-all flex flex-col items-center gap-2"
          >
            <Plus className="w-6 h-6 text-purple-400" />
            <span>New Card</span>
          </button>
          <button className="bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-xl p-4 transition-all flex flex-col items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            <span>Security</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Your Virtual Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 ${
                  card.type === 'debit'
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-600'
                    : 'bg-gradient-to-br from-purple-600 to-pink-600'
                } text-white shadow-xl overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-sm font-medium opacity-80">
                      {card.type.toUpperCase()} CARD
                    </div>
                    <Sparkles className="w-6 h-6 opacity-80" />
                  </div>
                  <div className="mb-6">
                    <p className="text-lg font-mono tracking-wider mb-1">
                      {card.cardNumber.match(/.{1,4}/g)?.join(' ')}
                    </p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80 mb-1">CARDHOLDER</p>
                      <p className="font-semibold">{card.cardholderName}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80 mb-1">EXPIRES</p>
                      <p className="font-semibold">{card.expiryDate}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {cards.length === 0 && (
              <div className="col-span-full text-center py-12 bg-zinc-800/30 rounded-2xl border border-zinc-700 border-dashed">
                <CreditCard className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400 mb-4">No cards issued yet</p>
                <button
                  onClick={() => setShowCardForm(true)}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  Issue Your First Card
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <History className="w-6 h-6" />
            Recent Transactions
          </h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            {transactions.length > 0 ? (
              <div className="divide-y divide-zinc-800">
                {transactions.slice(0, 10).map((txn) => (
                  <div
                    key={txn.id}
                    className="p-4 hover:bg-zinc-800/50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          txn.type === 'deposit'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : txn.type === 'withdrawal'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        {txn.type === 'deposit' ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : txn.type === 'withdrawal' ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{txn.description}</p>
                        <p className="text-sm text-zinc-400">
                          {new Date(txn.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          txn.type === 'deposit'
                            ? 'text-emerald-400'
                            : txn.type === 'withdrawal'
                            ? 'text-red-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        {txn.type === 'deposit' ? '+' : '-'}${txn.amount.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          txn.status === 'completed'
                            ? 'text-green-400'
                            : txn.status === 'pending'
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}
                      >
                        {txn.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">No transactions yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {showCardForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-6">Issue New Virtual Card</h3>
              <form onSubmit={handleIssueCard} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Type</label>
                  <select
                    value={cardForm.type}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, type: e.target.value as 'debit' | 'credit' })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                  >
                    <option value="debit">Debit Card</option>
                    <option value="credit">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardForm.cardholderName}
                    onChange={(e) =>
                      setCardForm({ ...cardForm, cardholderName: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                {cardForm.type === 'credit' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Credit Limit</label>
                    <input
                      type="number"
                      value={cardForm.creditLimit}
                      onChange={(e) =>
                        setCardForm({ ...cardForm, creditLimit: Number(e.target.value) })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                      min="1000"
                      max="50000"
                    />
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCardForm(false)}
                    className="flex-1 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Issuing...' : 'Issue Card'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showPaymentForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-6">Make Payment</h3>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient DID</label>
                  <input
                    type="text"
                    value={paymentForm.recipient}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, recipient: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                    placeholder="did:dht:..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={paymentForm.description}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, description: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                {aiAgent.enabled && paymentForm.amount > aiAgent.maxAmount && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ Amount exceeds AI agent limit. Manual approval required.
                    </p>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Send Payment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showDepositForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold mb-6">Deposit Funds</h3>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                  <input
                    type="number"
                    value={depositForm.amount}
                    onChange={(e) =>
                      setDepositForm({ ...depositForm, amount: Number(e.target.value) })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Source</label>
                  <select
                    value={depositForm.source}
                    onChange={(e) =>
                      setDepositForm({ ...depositForm, source: e.target.value })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                    required
                  >
                    <option value="">Select source...</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Crypto Wallet">Crypto Wallet</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDepositForm(false)}
                    className="flex-1 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Deposit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
