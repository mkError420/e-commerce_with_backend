'use client'

import React, { useState, useEffect } from 'react'
import Container from '@/components/Container'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Chrome,
  Shield,
  Zap,
  Heart,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required'
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 2000)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setSuccess(false)
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      rememberMe: false
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const socialProviders = [
    {
      name: 'Google',
      icon: Chrome,
      color: 'bg-red-500 hover:bg-red-600',
      textColor: 'text-white'
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-shop_light_pink via-white to-shop_light_bg relative overflow-hidden'>
      {/* Animated Background Pattern */}
      <div className='absolute inset-0 opacity-10 pointer-events-none'>
        <div className='absolute top-10 left-10 w-64 h-64 bg-shop_dark_green rounded-full filter blur-3xl animate-pulse'></div>
        <div className='absolute bottom-10 right-10 w-80 h-80 bg-shop_orange rounded-full filter blur-3xl animate-pulse delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-shop_light_green rounded-full filter blur-3xl animate-pulse delay-500'></div>
      </div>

      {/* Floating Elements */}
      <div className='absolute top-20 right-10 w-16 h-16 bg-shop_dark_green/20 rounded-full animate-bounce delay-300'></div>
      <div className='absolute bottom-32 left-20 w-12 h-12 bg-shop_orange/20 rounded-full animate-bounce delay-700'></div>
      <div className='absolute top-1/3 right-1/4 w-8 h-8 bg-shop_light_green/20 rounded-full animate-bounce delay-1000'></div>

      <div className='relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8 animate-fade-in'>
            {/* Header */}
            <div className='text-center'>
              <Link href='/' className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-shop_dark_green to-shop_light_green rounded-3xl mb-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:rotate-3'>
                {isLogin ? <Lock className='w-10 h-10 text-white' /> : <User className='w-10 h-10 text-white' />}
              </Link>
              <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-shop_dark_green to-shop_light_green bg-clip-text text-transparent mb-4'>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className='text-gray-600 text-lg leading-relaxed'>
                {isLogin 
                  ? 'Sign in to access your personalized shopping experience'
                  : 'Join thousands of happy shoppers and unlock exclusive deals'
                }
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className='bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center'>
                <CheckCircle className='w-5 h-5 text-green-600 mr-3' />
                <span className='text-green-800 font-medium'>
                  {isLogin ? 'Login successful! Redirecting...' : 'Account created successfully!'}
                </span>
              </div>
            )}

            {/* Login/Signup Form */}
            <div className='bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Full Name Field (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <label className='block text-sm font-bold text-gray-900 mb-2'>
                      Full Name
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                        <User className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        type='text'
                        name='fullName'
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent transition-all duration-300 hover:border-shop_light_green ${
                          errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                        placeholder='Enter your full name'
                        aria-invalid={errors.fullName ? 'true' : 'false'}
                      />
                    </div>
                    {errors.fullName && (
                      <p className='mt-2 text-sm text-red-600 flex items-center'>
                        <AlertCircle className='w-4 h-4 mr-1' />
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                )}
                {/* Email Field */}
                <div>
                  <label className='block text-sm font-bold text-gray-900 mb-2'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <Mail className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent transition-all duration-300 hover:border-shop_light_green ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                      placeholder='Enter your email'
                      aria-invalid={errors.email ? 'true' : 'false'}
                    />
                  </div>
                  {errors.email && (
                    <p className='mt-2 text-sm text-red-600 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className='block text-sm font-bold text-gray-900 mb-2'>
                    Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <Lock className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent transition-all duration-300 hover:border-shop_light_green ${
                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                      placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                      aria-invalid={errors.password ? 'true' : 'false'}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 pr-4 flex items-center'
                    >
                      {showPassword ? (
                        <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                      ) : (
                        <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className='mt-2 text-sm text-red-600 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <label className='block text-sm font-bold text-gray-900 mb-2'>
                      Confirm Password
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                        <Lock className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent transition-all duration-300 hover:border-shop_light_green ${
                          errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                        placeholder='Confirm your password'
                        aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                      />
                      <button
                        type='button'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className='absolute inset-y-0 right-0 pr-4 flex items-center'
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                        ) : (
                          <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className='mt-2 text-sm text-red-600 flex items-center'>
                        <AlertCircle className='w-4 h-4 mr-1' />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {/* Remember Me (Login Only) & Forgot Password */}
                <div className='flex items-center justify-between'>
                  {isLogin && (
                    <div className='flex items-center'>
                      <input
                        id='remember-me'
                        name='rememberMe'
                        type='checkbox'
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className='h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-xl'
                      />
                      <label htmlFor='remember-me' className='ml-3 block text-sm text-gray-700 font-medium'>
                        Remember me
                      </label>
                    </div>
                  )}
                  <div className='text-sm'>
                    {isLogin ? (
                      <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500 transition-colors'>
                        Forgot password?
                      </a>
                    ) : (
                      <span className='text-gray-500 text-sm'>
                        By signing up, you agree to our terms
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold text-white bg-gradient-to-r from-shop_dark_green to-shop_light_green hover:from-shop_btn_dark_green hover:to-shop_dark_green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shop_dark_green rounded-xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group'
                >
                  {isLoading ? (
                    <div className='flex items-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3'></div>
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </div>
                  ) : (
                    <div className='flex items-center'>
                      {isLogin ? 'Sign In' : 'Sign Up'}
                      <ArrowRight className='ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300' />
                    </div>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className='relative my-8'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white text-gray-500 font-medium'>Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className='flex justify-center'>
                {socialProviders.map((provider) => (
                  <button
                    key={provider.name}
                    className={`flex justify-center items-center py-3 px-6 border border-gray-200 rounded-xl ${provider.color} ${provider.textColor} font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                  >
                    <provider.icon className='h-5 w-5 mr-2' />
                    {provider.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Login/Signup */}
            <div className='text-center'>
              <p className='text-gray-600 text-lg'>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button 
                  onClick={toggleMode}
                  className='font-bold text-shop_dark_green hover:text-shop_light_green transition-colors duration-300 hover:underline'
                >
                  {isLogin ? 'Sign up for free' : 'Sign in'}
                </button>
              </p>
            </div>

            {/* Trust Badges */}
            <div className='flex flex-wrap justify-center gap-6 text-sm text-gray-600'>
              <div className='flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md'>
                <Shield className='w-4 h-4 mr-2 text-shop_dark_green' />
                <span className='font-medium'>Secure login</span>
              </div>
              <div className='flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md'>
                <Zap className='w-4 h-4 mr-2 text-shop_orange' />
                <span className='font-medium'>Instant access</span>
              </div>
              <div className='flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md'>
                <Heart className='w-4 h-4 mr-2 text-red-500' />
                <span className='font-medium'>24/7 support</span>
              </div>
            </div>

            {/* Back to Home */}
            <div className='text-center'>
              <Link 
                href='/' 
                className='inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors font-medium'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
    </div>
  )
}

export default LoginPage
