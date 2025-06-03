import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { motion } from 'framer-motion';
import { Logo } from '../assets/logo';

type RegisterFormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>();
  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
            <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
            <p className="text-sm text-gray-600 mt-1">Join Moopa Banking today</p>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Full Name"
                leftIcon={<User size={18} />}
                error={errors.name?.message}
                {...register('name', { 
                  required: 'Full name is required'
                })}
              />
            </div>
            
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
                label="Phone Number"
                leftIcon={<Phone size={18} />}
                error={errors.phone?.message}
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\s]+$/,
                    message: 'Invalid phone number'
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
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
              />
            </div>
            
            <div>
              <Input
                label="Confirm Password"
                type="password"
                leftIcon={<Lock size={18} />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || "Passwords do not match"
                })}
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-900 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" className="text-blue-900 hover:text-blue-800 font-medium">Terms of Service</a> and <a href="#" className="text-blue-900 hover:text-blue-800 font-medium">Privacy Policy</a>
              </label>
            </div>
            
            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/" className="font-medium text-blue-900 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;