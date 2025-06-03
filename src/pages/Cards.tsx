import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, EyeOff, CreditCard, Lock, CheckCircle, ToggleLeft as Toggle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useApp } from '../contexts/AppContext';

const Cards = () => {
  const { cards, addCard, toggleCardStatus } = useApp();
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<'list' | 'creating' | 'success'>('list');

  const toggleCardDetails = (cardId: string) => {
    setShowCardDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleCreateCard = () => {
    setIsCreatingCard(true);
    setStep('creating');
    setIsLoading(true);
    
    // Simulate API call to create a virtual card
    setTimeout(() => {
      const newCard = {
        type: 'virtual',
        cardNumber: '5399 ' + Math.floor(1000 + Math.random() * 9000) + ' **** ' + Math.floor(1000 + Math.random() * 9000),
        expiryDate: '12/' + (new Date().getFullYear() + 4).toString().substring(2),
        cvv: Math.floor(100 + Math.random() * 900).toString(),
        isActive: true
      };
      
      addCard(newCard);
      setIsLoading(false);
      setStep('success');
    }, 2000);
  };

  const handleToggleCardStatus = (cardId: string) => {
    toggleCardStatus(cardId);
  };

  const handleBackToCards = () => {
    setStep('list');
    setIsCreatingCard(false);
  };

  return (
    <AppLayout title="Cards">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 'list' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">Your Cards</h2>
              <Button
                onClick={handleCreateCard}
                leftIcon={<Plus size={16} />}
                className="w-full sm:w-auto"
              >
                Create Virtual Card
              </Button>
            </div>
            
            {cards.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {cards.map(card => (
                  <div key={card.id} className={`relative overflow-hidden rounded-xl ${
                    card.isActive ? 'bg-gradient-to-r from-blue-900 to-blue-700' : 'bg-gray-700'
                  } p-4 sm:p-6 shadow-lg`}>
                    <div className="absolute top-0 right-0 mt-3 mr-3 sm:mt-4 sm:mr-4">
                      <div className={`px-2 py-1 rounded text-xs ${
                        card.isActive ? 'bg-green-500' : 'bg-gray-500'
                      } text-white`}>
                        {card.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <div className="mb-4 sm:mb-6">
                      <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <CreditCard size={32} className="text-white" />
                        <span className="text-white text-sm">{card.type.toUpperCase()}</span>
                      </div>
                      
                      <div className="text-white mb-4">
                        <div className="text-sm mb-1">Card Number</div>
                        <div className="font-mono text-xl flex items-center">
                          {showCardDetails[card.id] ? card.cardNumber : '•••• •••• •••• ••••'}
                          <button 
                            onClick={() => toggleCardDetails(card.id)}
                            className="ml-2 focus:outline-none"
                          >
                            {showCardDetails[card.id] ? 
                              <EyeOff size={16} className="text-white opacity-70" /> : 
                              <Eye size={16} className="text-white opacity-70" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-white">
                        <div>
                          <div className="text-xs mb-1">Expiry Date</div>
                          <div className="font-mono">
                            {showCardDetails[card.id] ? card.expiryDate : '••/••'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs mb-1">CVV</div>
                          <div className="font-mono">
                            {showCardDetails[card.id] ? card.cvv : '•••'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-white bg-opacity-10 border-white border-opacity-20 text-white hover:bg-white hover:bg-opacity-20"
                        leftIcon={<Lock size={16} />}
                      >
                        Block Card
                      </Button>
                      <Button
                        size="sm"
                        variant={card.isActive ? "danger" : "secondary"}
                        className="flex-1"
                        leftIcon={<Toggle size={16} />}
                        onClick={() => handleToggleCardStatus(card.id)}
                      >
                        {card.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <CreditCard size={32} className="text-blue-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cards Yet</h3>
                  <p className="text-gray-500 mb-6">
                    You don't have any cards yet. Create a virtual card to get started.
                  </p>
                  <Button
                    onClick={handleCreateCard}
                    leftIcon={<Plus size={16} />}
                  >
                    Create Virtual Card
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === 'creating' && (
          <Card>
            <CardHeader>
              <CardTitle>Create Virtual Card</CardTitle>
              <CardDescription>Your new virtual card is being created</CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4"></div>
              <p className="text-center text-gray-600">
                Please wait while we create your virtual card. This may take a moment.
              </p>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Virtual Card Created!</h3>
              <p className="text-gray-600 mb-6">
                Your new virtual card has been created successfully. You can now use it for online transactions.
              </p>
              
              <Button
                type="button"
                className="w-full"
                onClick={handleBackToCards}
              >
                View My Cards
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default Cards;