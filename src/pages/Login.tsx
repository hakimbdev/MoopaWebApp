import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion } from 'framer-motion';
import { Logo } from '../assets/logo';

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col justify-center p-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Logo className="h-12 sm:h-16 mx-auto" />
          <p className="mt-4 text-white text-opacity-80 text-sm sm:text-base px-4">Nigeria's Smart Banking Platform for Everyone</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 sm:mt-8 bg-white py-6 sm:py-8 px-4 shadow-lg rounded-lg sm:rounded-lg sm:px-10"
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-600 mt-1">Log in to your Moopa account</p>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Email Address"
                type="email"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </div>
            
            <div>
              <Input
                label="Password"
                type="password"
                leftIcon={<Lock size={18} />}
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-900 hover:text-blue-800">
                  Forgot your password?
                </a>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-900 hover:text-blue-800">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;