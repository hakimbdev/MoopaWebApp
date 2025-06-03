import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Tv, Wifi, CheckCircle, Phone, AlertCircle, User2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

type BillCategory = 'airtime' | 'data' | 'tv' | 'electricity';

interface BillFormValues {
  category: BillCategory;
  provider: string;
  phoneNumber?: string;
  amount: string;
  planId?: string;
  smartCardNumber?: string;
  meterNumber?: string;
}

const BillPayment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addTransaction } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState<BillCategory | null>(null);
  const [step, setStep] = useState<'category' | 'details' | 'confirm' | 'success'>('category');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<BillFormValues>({
    defaultValues: {
      category: 'airtime',
      provider: '',
      amount: '',
    }
  });
  const watchedValues = watch();

  const categories = [
    { id: 'airtime', label: 'Airtime', icon: <Phone size={24} /> },
    { id: 'data', label: 'Data Bundle', icon: <Wifi size={24} /> },
    { id: 'tv', label: 'TV Subscription', icon: <Tv size={24} /> },
    // { id: 'electricity', label: 'Electricity', icon: <Zap size={24} /> },
  ];

  const providers = {
    airtime: [
      { value: 'mtn', label: 'MTN Nigeria' },
      { value: 'airtel', label: 'Airtel Nigeria' },
      { value: 'glo', label: 'Glo Nigeria' },
      { value: '9mobile', label: '9mobile' },
    ],
    data: [
      { value: 'mtn', label: 'MTN Nigeria' },
      { value: 'airtel', label: 'Airtel Nigeria' },
      { value: 'glo', label: 'Glo Nigeria' },
      { value: '9mobile', label: '9mobile' },
    ],
    tv: [
      { value: 'dstv', label: 'DSTV' },
      { value: 'gotv', label: 'GOtv' },
      { value: 'startimes', label: 'StarTimes' },
    ],
  };

  const dataBundles = {
    mtn: [
      { value: 'mtn-100mb', label: '100MB - ₦200 (24hrs)' },
      { value: 'mtn-1gb', label: '1GB - ₦1,000 (30 days)' },
      { value: 'mtn-2gb', label: '2GB - ₦1,500 (30 days)' },
      { value: 'mtn-5gb', label: '5GB - ₦3,500 (30 days)' },
    ],
    airtel: [
      { value: 'airtel-100mb', label: '100MB - ₦200 (24hrs)' },
      { value: 'airtel-1gb', label: '1GB - ₦1,000 (30 days)' },
      { value: 'airtel-2gb', label: '2GB - ₦1,500 (30 days)' },
      { value: 'airtel-5gb', label: '5GB - ₦3,500 (30 days)' },
    ],
    glo: [
      { value: 'glo-100mb', label: '100MB - ₦200 (24hrs)' },
      { value: 'glo-1gb', label: '1GB - ₦1,000 (30 days)' },
      { value: 'glo-2gb', label: '2GB - ₦1,500 (30 days)' },
      { value: 'glo-5gb', label: '5GB - ₦3,500 (30 days)' },
    ],
    '9mobile': [
      { value: '9mobile-100mb', label: '100MB - ₦200 (24hrs)' },
      { value: '9mobile-1gb', label: '1GB - ₦1,000 (30 days)' },
      { value: '9mobile-2gb', label: '2GB - ₦1,500 (30 days)' },
      { value: '9mobile-5gb', label: '5GB - ₦3,500 (30 days)' },
    ],
  };

  const tvPlans = {
    dstv: [
      { value: 'dstv-access', label: 'DStv Access - ₦2,000' },
      { value: 'dstv-family', label: 'DStv Family - ₦4,000' },
      { value: 'dstv-compact', label: 'DStv Compact - ₦9,000' },
      { value: 'dstv-premium', label: 'DStv Premium - ₦21,000' },
    ],
    gotv: [
      { value: 'gotv-lite', label: 'GOtv Lite - ₦900' },
      { value: 'gotv-jinja', label: 'GOtv Jinja - ₦1,900' },
      { value: 'gotv-jolli', label: 'GOtv Jolli - ₦3,300' },
      { value: 'gotv-max', label: 'GOtv Max - ₦4,850' },
    ],
    startimes: [
      { value: 'startimes-nova', label: 'StarTimes Nova - ₦900' },
      { value: 'startimes-basic', label: 'StarTimes Basic - ₦1,850' },
      { value: 'startimes-smart', label: 'StarTimes Smart - ₦2,600' },
      { value: 'startimes-super', label: 'StarTimes Super - ₦4,900' },
    ],
  };

  const handleCategorySelect = (category: BillCategory) => {
    setSelectedCategory(category);
    setValue('category', category);
    // Reset other fields when category changes
    reset({ category, provider: '', amount: '' });
    setStep('details');
  };

  const handlePlanSelect = (planId: string) => {
    setValue('planId', planId);
    
    // Set amount based on selected plan
    let amount = '';
    if (selectedCategory === 'data') {
      const provider = watchedValues.provider;
      const selectedPlan = dataBundles[provider as keyof typeof dataBundles]?.find(p => p.value === planId);
      if (selectedPlan) {
        // Extract amount from the label (e.g., "1GB - ₦1,000 (30 days)" -> "1000")
        const match = selectedPlan.label.match(/₦([\d,]+)/);
        if (match) {
          amount = match[1].replace(',', '');
        }
      }
    } else if (selectedCategory === 'tv') {
      const provider = watchedValues.provider;
      const selectedPlan = tvPlans[provider as keyof typeof tvPlans]?.find(p => p.value === planId);
      if (selectedPlan) {
        // Extract amount from the label (e.g., "DStv Access - ₦2,000" -> "2000")
        const match = selectedPlan.label.match(/₦([\d,]+)/);
        if (match) {
          amount = match[1].replace(',', '');
        }
      }
    }
    
    if (amount) {
      setValue('amount', amount);
    }
  };

  const onSubmit = (data: BillFormValues) => {
    if (step === 'details') {
      // Move to confirmation
      setStep('confirm');
    } else if (step === 'confirm') {
      // Process payment
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Get description based on category
        let description = '';
        if (data.category === 'airtime') {
          const provider = providers.airtime.find(p => p.value === data.provider)?.label;
          description = `${provider} Airtime Recharge`;
        } else if (data.category === 'data') {
          const provider = providers.data.find(p => p.value === data.provider)?.label;
          const plan = dataBundles[data.provider as keyof typeof dataBundles]?.find(p => p.value === data.planId)?.label;
          description = `${provider} Data Bundle - ${plan?.split(' - ')[0]}`;
        } else if (data.category === 'tv') {
          const provider = providers.tv.find(p => p.value === data.provider)?.label;
          const plan = tvPlans[data.provider as keyof typeof tvPlans]?.find(p => p.value === data.planId)?.label;
          description = `${provider} Subscription - ${plan?.split(' - ')[0]}`;
        }
        
        // Add transaction
        addTransaction({
          type: 'debit',
          amount: parseFloat(data.amount),
          description,
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

  const handleNewPayment = () => {
    setStep('category');
    setSelectedCategory(null);
    reset();
  };

  const getProviderLabel = () => {
    if (!selectedCategory || !watchedValues.provider) return '';
    return providers[selectedCategory]?.find(p => p.value === watchedValues.provider)?.label || '';
  };

  return (
    <AppLayout title="Bill Payment">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        {step === 'select-service' && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Select Service</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {services.map((service, index) => (
                <Card
                  key={index}
                  onClick={() => handleSelectService(service.type)}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 text-center">
                    <div className={cn(
                      "w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3",
                      service.bgColor
                    )}>
                      {service.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'form' && (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <CardTitle>Pay {selectedService}</CardTitle>
                  <CardDescription>Enter payment details</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Account/Service Number"
                    {...register('accountNumber', { 
                      required: 'Account/Service number is required' 
                    })}
                    error={errors.accountNumber?.message}
                  />
                  
                  <Input
                    label="Amount"
                    type="number"
                    {...register('amount', { 
                      required: 'Amount is required',
                      min: { value: 100, message: 'Minimum amount is ₦100' }
                    })}
                    error={errors.amount?.message}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isLoading || !isValid}
                  isLoading={isLoading}
                >
                  Continue to Pay
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'details' && selectedCategory && (
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCategory === 'airtime' ? 'Buy Airtime' : 
                 selectedCategory === 'data' ? 'Buy Data Bundle' :
                 selectedCategory === 'tv' ? 'TV Subscription' : 'Pay Bills'}
              </CardTitle>
              <CardDescription>Enter details to continue</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Select
                  label="Select Provider"
                  options={selectedCategory ? providers[selectedCategory] : []}
                  error={errors.provider?.message}
                  {...register('provider', { required: 'Provider is required' })}
                />

                {selectedCategory === 'airtime' && (
                  <>
                    <Input
                      label="Phone Number"
                      leftIcon={<Smartphone size={18} />}
                      error={errors.phoneNumber?.message}
                      {...register('phoneNumber', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{11}$/,
                          message: 'Please enter a valid 11-digit phone number'
                        }
                      })}
                    />
                    
                    <Input
                      label="Amount (₦)"
                      type="number"
                      error={errors.amount?.message}
                      {...register('amount', { 
                        required: 'Amount is required',
                        min: {
                          value: 50,
                          message: 'Minimum amount is ₦50'
                        },
                        max: {
                          value: 10000,
                          message: 'Maximum amount is ₦10,000'
                        }
                      })}
                    />
                  </>
                )}

                {selectedCategory === 'data' && watchedValues.provider && (
                  <>
                    <Input
                      label="Phone Number"
                      leftIcon={<Smartphone size={18} />}
                      error={errors.phoneNumber?.message}
                      {...register('phoneNumber', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{11}$/,
                          message: 'Please enter a valid 11-digit phone number'
                        }
                      })}
                    />
                    
                    <Select
                      label="Select Data Plan"
                      options={dataBundles[watchedValues.provider as keyof typeof dataBundles] || []}
                      error={errors.planId?.message}
                      {...register('planId', { required: 'Data plan is required' })}
                      onChange={(e) => handlePlanSelect(e.target.value)}
                    />
                  </>
                )}

                {selectedCategory === 'tv' && watchedValues.provider && (
                  <>
                    <Input
                      label="Smart Card / IUC Number"
                      error={errors.smartCardNumber?.message}
                      {...register('smartCardNumber', { 
                        required: 'Smart card number is required',
                        pattern: {
                          value: /^[0-9]+$/,
                          message: 'Please enter a valid smart card number'
                        }
                      })}
                    />
                    
                    <Select
                      label="Select Subscription Plan"
                      options={tvPlans[watchedValues.provider as keyof typeof tvPlans] || []}
                      error={errors.planId?.message}
                      {...register('planId', { required: 'Subscription plan is required' })}
                      onChange={(e) => handlePlanSelect(e.target.value)}
                    />
                  </>
                )}
                
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={Object.keys(errors).length > 0}
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
              <CardTitle>Confirm Payment</CardTitle>
              <CardDescription>Please review your payment details</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium capitalize">{watchedValues.category}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider</span>
                    <span className="font-medium">{getProviderLabel()}</span>
                  </div>
                  
                  {watchedValues.phoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone Number</span>
                      <span className="font-medium">{watchedValues.phoneNumber}</span>
                    </div>
                  )}
                  
                  {watchedValues.smartCardNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Smart Card Number</span>
                      <span className="font-medium">{watchedValues.smartCardNumber}</span>
                    </div>
                  )}
                  
                  {watchedValues.planId && selectedCategory === 'data' && watchedValues.provider && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Plan</span>
                      <span className="font-medium">
                        {dataBundles[watchedValues.provider as keyof typeof dataBundles]?.find(p => p.value === watchedValues.planId)?.label.split(' - ')[0]}
                      </span>
                    </div>
                  )}
                  
                  {watchedValues.planId && selectedCategory === 'tv' && watchedValues.provider && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subscription</span>
                      <span className="font-medium">
                        {tvPlans[watchedValues.provider as keyof typeof tvPlans]?.find(p => p.value === watchedValues.planId)?.label.split(' - ')[0]}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-800 font-medium">Amount</span>
                    <span className="font-bold text-green-600">{formatCurrency(watchedValues.amount)}</span>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg flex">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-amber-800">
                      This transaction cannot be reversed once completed. Please ensure all details are correct.
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
                    Pay Now
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
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your transaction has been completed successfully.
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
                  onClick={handleNewPayment}
                >
                  Make Another Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default BillPayment;