import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowUpRight, Zap, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions } = useApp();
  const navigate = useNavigate();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const quickActions = [
    { icon: <ArrowUpRight size={20} />, label: "Transfer", action: () => navigate('/transfer'), color: "bg-blue-100 text-blue-900" },
    { icon: <Zap size={20} />, label: "Airtime", action: () => navigate('/bill-payment'), color: "bg-purple-100 text-purple-900" },
    { icon: <TrendingUp size={20} />, label: "Data", action: () => navigate('/bill-payment'), color: "bg-green-100 text-green-900" },
    { icon: <Calendar size={20} />, label: "TV Sub", action: () => navigate('/bill-payment'), color: "bg-amber-100 text-amber-900" },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <CardContent className="py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-white text-opacity-80 text-sm sm:text-base">Available Balance</h3>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">{formatCurrency(user?.balance || 0)}</p>
                  <p className="text-sm text-white text-opacity-80 mt-1">
                    Account Number: {user?.accountNumber}
                  </p>
                </div>
                <div className="sm:mt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto bg-white bg-opacity-10 border-white border-opacity-20 text-white hover:bg-white hover:bg-opacity-20"
                    rightIcon={<PlusCircle size={16} />}
                  >
                    Fund Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-3`}>
                    {action.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-900"
              rightIcon={<ChevronRight size={16} />}
            >
              View All
            </Button>
          </div>

          <Card>
            {transactions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        <ArrowUpRight 
                          size={18} 
                          className={transaction.type === 'credit' ? '' : 'transform rotate-180'} 
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <CardContent>
                <p className="text-center text-gray-500 py-6">No transactions yet</p>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;