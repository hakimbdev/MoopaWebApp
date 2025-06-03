import React, { createContext, useContext, useState } from 'react';

type Transaction = {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  recipient?: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
};

type Card = {
  id: string;
  type: 'virtual' | 'physical';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  isActive: boolean;
};

type AppContextType = {
  transactions: Transaction[];
  cards: Card[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  addCard: (card: Omit<Card, 'id'>) => void;
  toggleCardStatus: (id: string) => void;
};

const initialContext: AppContextType = {
  transactions: [],
  cards: [],
  addTransaction: () => {},
  addCard: () => {},
  toggleCardStatus: () => {},
};

const AppContext = createContext<AppContextType>(initialContext);

export const useApp = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock initial transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'credit',
      amount: 50000,
      description: 'Salary Payment',
      date: new Date('2024-10-01'),
      status: 'completed'
    },
    {
      id: '2',
      type: 'debit',
      amount: 2500,
      description: 'Airtime Purchase',
      date: new Date('2024-10-02'),
      status: 'completed'
    },
    {
      id: '3',
      type: 'debit',
      amount: 15000,
      recipient: 'Jane Smith',
      description: 'Transfer to Jane',
      date: new Date('2024-10-03'),
      status: 'completed'
    }
  ]);

  // Mock initial cards
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      type: 'virtual',
      cardNumber: '4123 **** **** 5678',
      expiryDate: '12/26',
      cvv: '***',
      isActive: true
    }
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addCard = (card: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...card,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    setCards(prev => [...prev, newCard]);
  };

  const toggleCardStatus = (id: string) => {
    setCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, isActive: !card.isActive } : card
      )
    );
  };

  return (
    <AppContext.Provider 
      value={{ 
        transactions,
        cards,
        addTransaction,
        addCard,
        toggleCardStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};