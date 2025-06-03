import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building, User2, Search, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

type TransferFormValues = {
  bank: string;
  accountNumber: string;
  amount: string;
  narration: string;
};

const NIGERIAN_BANKS = [
  { value: '', label: 'Select Bank' },
  { value: 'moopa', label: 'Moopa Bank' },
  { value: 'zenith', label: 'Zenith Bank' },
  { value: 'gtbank', label: 'GTBank' },
  { value: 'firstbank', label: 'First Bank' },
  { value: 'uba', label: 'United Bank for Africa' },
  { value: 'access', label: 'Access Bank' },
];

const Transfer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTransaction } = useApp();
  
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TransferFormValues>();
  const watchedValues = watch();

  const handleAccountValidation = () => {
    // Simulate account validation
    setIsLoading(true);
    setTimeout(() => {
      setRecipientName('Jane Doe');
      setIsLoading(false);
    }, 1000);
  };

  const onSubmit = (data: TransferFormValues) => {
    if (step === 'details') {
      // Move to confirmation step
      setStep('confirm');
    } else if (step === 'confirm') {
      // Process the transfer
      setIsLoading(true);
      
      // Simulate transfer processing
      setTimeout(() => {
        // Add transaction to history
        addTransaction({
          type: 'debit',
          amount: parseFloat(data.amount),
          description: `Transfer to ${recipientName}`,
          recipient: recipientName,
          status: 'completed'
        });
        
        setIsLoading(false);
        setStep('success');
      }, 2000);
    }
  };
  
  const formatCurrency = (amount: string) => {
    if (!amount) return '';
    const number = parseFloat(amount);
    if (isNaN(number)) return '';
    
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(number);
  };

  const getSelectedBankName = () => {
    const bank = NIGERIAN_BANKS.find(b => b.value === watchedValues.bank);
    return bank ? bank.label : '';
  };

  const handleNewTransfer = () => {
    setStep('details');
  };

  return (
    <AppLayout title="Transfer">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        {step === 'details' && (
          <Card>
            <CardHeader>
              <CardTitle>Make a Transfer</CardTitle>
              <CardDescription>Send money to anyone</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Account Number"
                    {...register('accountNumber', { required: 'Account number is required' })}
                    error={errors.accountNumber?.message}
                  />
                  <Input
                    label="Bank Name"
                    {...register('bankName', { required: 'Bank name is required' })}
                    error={errors.bankName?.message}
                  />
                </div>
                
                <div className="space-y-4">
                  <Input
                    label="Amount (₦)"
                    type="number"
                    error={errors.amount?.message}
                    {...register('amount', { 
                      required: 'Amount is required',
                      min: {
                        value: 100,
                        message: 'Minimum transfer amount is ₦100'
                      },
                      max: {
                        value: user?.balance || 0,
                        message: 'Amount exceeds your balance'
                      }
                    })}
                  />
                  
                  <Input
                    label="Narration (Optional)"
                    {...register('narration')}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={!recipientName || Object.keys(errors).length > 0}
                >
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'confirm' && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Transfer</CardTitle>
              <CardDescription>Please review your transfer details</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">From</span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Balance</span>
                    <span className="font-medium">{formatCurrency(user?.balance?.toString() || '0')}</span>
                  </div>
                </div>
                
                <div className="flex justify-center my-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <ArrowRight size={20} className="text-blue-900" />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">To</span>
                    <span className="font-medium">{recipientName}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Bank</span>
                    <span className="font-medium">{getSelectedBankName()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Account Number</span>
                    <span className="font-medium">{watchedValues.accountNumber}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium text-green-600">{formatCurrency(watchedValues.amount || '0')}</span>
                  </div>
                  {watchedValues.narration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Narration</span>
                      <span className="font-medium">{watchedValues.narration}</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg flex">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-amber-800">
                      Please verify all details carefully. Transfers cannot be reversed once completed.
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep('details')}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    isLoading={isLoading}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Confirm Transfer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'success' && (
          <Card>
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transfer Successful!</h3>
              <p className="text-gray-600 mb-6">
                {formatCurrency(watchedValues.amount || '0')} has been sent to {recipientName}
              </p>
              
              <div className="space-y-3">
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  Return to Dashboard
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleNewTransfer}
                >
                  Make Another Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default Transfer;