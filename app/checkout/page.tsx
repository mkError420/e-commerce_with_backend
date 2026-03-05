'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  Truck, 
  Shield, 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package,
  Check
} from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

const CheckoutPage = () => {
  const { cartItems, getCartTotal, getCartItemsCount, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [discount, setDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    zipCode: '',
    country: ''
  })
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    bkashNumber: '',
    nagadNumber: '',
    rocketNumber: '',
    transactionId: ''
  })
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Read coupon info from URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const couponCode = urlParams.get('coupon')
    const discountAmount = urlParams.get('discount')
    
    if (couponCode && discountAmount) {
      setDiscount(Number(discountAmount))
      setAppliedCoupon({ code: couponCode })
    }
  }, [])

  const subtotal = getCartTotal()
  const shipping = subtotal >= 10000 ? 0 : (shippingInfo.district.toLowerCase() === 'dhaka' ? 0 : 120)
  const tax = 0
  const totalAfterDiscount = subtotal - discount
  const total = totalAfterDiscount + shipping + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
    const items = cartItems.map(item => {
      const obj = item.itemType === 'product' ? item.product : item.deal
      const price = item.itemType === 'product' ? (item.product?.price ?? 0) : (item.deal?.dealPrice ?? 0)
      const name = item.itemType === 'product' ? item.product?.name : item.deal?.title
      const productId = item.itemType === 'product' ? String(item.product?.id) : String(item.deal?.id)
      return { productId, name, price, quantity: item.quantity, itemType: item.itemType }
    })
    const paymentInfoStr = paymentInfo.transactionId || paymentInfo.cardNumber || paymentInfo.bkashNumber || paymentInfo.nagadNumber || paymentInfo.rocketNumber || ''
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: shippingInfo.name,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          district: shippingInfo.district,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          items,
          subtotal,
          discount,
          totalAfterDiscount,
          shipping,
          total,
          paymentMethod: paymentInfo.paymentMethod,
          paymentInfo: paymentInfoStr,
          couponCode: appliedCoupon?.code || null,
          couponDiscount: discount
        })
      })
      const json = await res.json()
      if (json?.data?.orderNumber) {
        setOrderPlaced(true)
        clearCart()
        router.push(`/confirmation?order=${json.data.orderNumber}&amount=${total}&items=${getCartItemsCount()}&method=${paymentInfo.paymentMethod}`)
      } else {
        throw new Error(json?.error || 'Order failed')
      }
    } catch (err) {
      setStep(2)
      alert('Order failed. Please try again.')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center'>
            <Package className='w-16 h-16 text-gray-400' />
          </div>
          <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Your cart is empty</h2>
          <p className='text-gray-600 mb-8'>Add some products to proceed with checkout</p>
          <Link 
            href='/shop'
            className='inline-flex items-center bg-shop_btn_dark_green text-white px-8 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg transition-all duration-300'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md'>
          <div className='w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center'>
            <Check className='w-12 h-12 text-green-600' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Order Confirmed!</h1>
          <p className='text-gray-600 mb-8'>
            Thank you for your purchase. Your order has been successfully placed and will be delivered soon.
          </p>
          <div className='space-y-3'>
            <Link 
              href='/'
              className='w-full bg-shop_btn_dark_green text-white py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg transition-all duration-300 block text-center'
            >
              Continue Shopping
            </Link>
            <Link 
              href='/account/orders'
              className='w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors block text-center'
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <Link href='/cart' className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-4'>
            <ArrowLeft className='w-5 h-5 mr-2' />
            Back to Cart
          </Link>
          <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
          
          {/* Progress Steps */}
          <div className='flex items-center justify-center mt-8'>
            <div className={`flex items-center ${step >= 1 ? 'text-shop_dark_green' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-shop_dark_green text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className='ml-2 font-medium'>Shipping</span>
            </div>
            <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-shop_dark_green' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-shop_dark_green' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-shop_dark_green text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className='ml-2 font-medium'>Payment</span>
            </div>
            <div className={`w-16 h-1 mx-4 ${step >= 3 ? 'bg-shop_dark_green' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-shop_dark_green' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-shop_dark_green text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className='ml-2 font-medium'>Confirmation</span>
            </div>
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {step === 1 && (
              /* Shipping Information */
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
                  <Truck className='w-5 h-5 mr-2 text-shop_dark_green' />
                  Shipping Information
                </h2>
                <form onSubmit={handleShippingSubmit}>
                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Name</label>
                    <input
                      type='text'
                      required
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                      placeholder='John Doe'
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                      <input
                        type='email'
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                        placeholder='john@gmail.com'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
                      <input
                        type='tel'
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                        placeholder='+880 *********'
                      />
                    </div>
                  </div>

                  <div className='mb-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Address</label>
                    <input
                      type='text'
                      required
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                      placeholder='Your pick-up point'
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>District</label>
                      <input
                        type='text'
                        required
                        value={shippingInfo.district}
                        onChange={(e) => setShippingInfo({...shippingInfo, district: e.target.value})}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                        placeholder='Dhaka'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>ZIP Code</label>
                      <input
                        type='text'
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                        placeholder='10001'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>Country</label>
                      <input
                        type='text'
                        required
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                        placeholder='United States'
                      />
                    </div>
                  </div>

                  <button
                    type='submit'
                    className='w-full bg-shop_btn_dark_green text-white py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg transition-all duration-300'
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              /* Payment Information */
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-6 flex items-center'>
                  <CreditCard className='w-5 h-5 mr-2 text-shop_dark_green' />
                  Payment Information
                </h2>
                <form onSubmit={handlePaymentSubmit}>
                  {/* Payment Method Selection */}
                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-3'>Payment Method</label>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                      <button
                        type='button'
                        onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: 'card'})}
                        className={`p-3 border rounded-lg font-medium transition-all duration-300 ${
                          paymentInfo.paymentMethod === 'card'
                            ? 'border-shop_dark_green bg-shop_dark_green text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className='w-5 h-5 mr-2' />
                        Card
                      </button>
                      <button
                        type='button'
                        onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: 'bkash'})}
                        className={`p-3 border rounded-lg font-medium transition-all duration-300 ${
                          paymentInfo.paymentMethod === 'bkash'
                            ? 'border-pink-500 bg-pink-500 text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className='flex items-center'>
                          <div className='w-5 h-5 mr-2 bg-white rounded-full flex items-center justify-center'>
                            <span className='text-pink-600 font-bold text-xs'>bK</span>
                          </div>
                          bKash
                        </div>
                      </button>
                      <button
                        type='button'
                        onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: 'nagad'})}
                        className={`p-3 border rounded-lg font-medium transition-all duration-300 ${
                          paymentInfo.paymentMethod === 'nagad'
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className='flex items-center'>
                          <div className='w-5 h-5 mr-2 bg-white rounded-full flex items-center justify-center'>
                            <span className='text-orange-600 font-bold text-xs'>N</span>
                          </div>
                          Nagad
                        </div>
                      </button>
                      <button
                        type='button'
                        onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: 'rocket'})}
                        className={`p-3 border rounded-lg font-medium transition-all duration-300 ${
                          paymentInfo.paymentMethod === 'rocket'
                            ? 'border-purple-500 bg-purple-500 text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className='flex items-center'>
                          <div className='w-5 h-5 mr-2 bg-white rounded-full flex items-center justify-center'>
                            <span className='text-purple-600 font-bold text-xs'>R</span>
                          </div>
                          Rocket
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Received Payment Numbers */}
                  <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                    <h3 className='text-sm font-medium text-gray-700 mb-3'>Received Payment Numbers (Send Money Only)</h3>
                    <div className='space-y-2 text-sm'>
                      <div className='flex items-center gap-2'>
                        <span className='text-gray-600'>bKash:</span>
                        <span className='font-mono text-gray-900 bg-white px-2 py-1 rounded'>01854718767</span>     
                        <span className='text-gray-600'>Nagad:</span>
                        <span className='font-mono text-gray-900 bg-white px-2 py-1 rounded'>01854718767</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-gray-600'>Rocket:</span>
                        <span className='font-mono text-gray-900 bg-white px-2 py-1 rounded'>01572491828</span>
                        <span className='text-gray-600'>(Rocket)</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Payment Form */}
                  {paymentInfo.paymentMethod === 'card' && (
                    <div className='space-y-6'>
                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Card Number</label>
                        <input
                          type='text'
                          required
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                          placeholder='1234 5678 9012 3456'
                          maxLength={19}
                        />
                      </div>

                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Cardholder Name</label>
                        <input
                          type='text'
                          required
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                          placeholder='John Doe'
                        />
                      </div>

                      <div className='grid grid-cols-2 gap-4 mb-6'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>Expiry Date</label>
                          <input
                            type='text'
                            required
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                            placeholder='MM/YY'
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>CVV</label>
                          <input
                            type='text'
                            required
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                            placeholder='123'
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* bKash Payment Form */}
                  {paymentInfo.paymentMethod === 'bkash' && (
                    <div className='space-y-6'>
                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>bKash Account Number</label>
                        <input
                          type='text'
                          required
                          value={paymentInfo.bkashNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, bkashNumber: e.target.value})}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500'
                          placeholder='01xxxxxxxxxxx'
                        />
                      </div>

                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Transaction ID</label>
                        <input
                          type='text'
                          required
                          value={paymentInfo.transactionId}
                          onChange={(e) => setPaymentInfo({...paymentInfo, transactionId: e.target.value})}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500'
                          placeholder='Enter transaction ID'
                        />
                      </div>
                    </div>
                  )}

                  {/* Nagad Payment Form */}
                  {paymentInfo.paymentMethod === 'nagad' && (
                    <div className='space-y-6'>
                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Nagad Account Number</label>
                        <input
                          type='text'
                          required
                          value={paymentInfo.nagadNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, nagadNumber: e.target.value})}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                          placeholder='01xxxxxxxxxxx'
                        />
                      </div>

                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Transaction ID</label>
                        <input
                          type='text'
                          required
                          value={paymentInfo.transactionId}
                          onChange={(e) => setPaymentInfo({...paymentInfo, transactionId: e.target.value})}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                          placeholder='Enter transaction ID'
                        />
                      </div>
                    </div>
                  )}

                  {/* Rocket Payment Form */}
                  {paymentInfo.paymentMethod === 'rocket' && (
                    <div className='space-y-6'>
                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Rocket Account Number</label>
                        <input
                          type='text'
                          required
                          value={paymentInfo.rocketNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, rocketNumber: e.target.value})}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                          placeholder='01xxxxxxxxxxx'
                        />
                      </div>

                      <div className='mb-6'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Transaction ID</label>
                        <input
                          type='text'
                          required
                          value={paymentInfo.transactionId}
                          onChange={(e) => setPaymentInfo({...paymentInfo, transactionId: e.target.value})}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                          placeholder='Enter transaction ID'
                        />
                      </div>
                    </div>
                  )}

                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                    <div className='flex items-center'>
                      <Shield className='w-5 h-5 text-blue-600 mr-2' />
                      <span className='text-sm text-blue-800'>
                        Your payment information is secure and encrypted
                      </span>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <button
                      type='button'
                      onClick={() => setStep(1)}
                      className='w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors'
                    >
                      Back to Shipping
                    </button>
                    <button
                      type='submit'
                      className='w-full bg-shop_btn_dark_green text-white py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg transition-all duration-300'
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              /* Order Processing */
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center'>
                <div className='w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center'>
                  <Package className='w-8 h-8 text-blue-600 animate-pulse' />
                </div>
                <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Processing Your Order</h2>
                <p className='text-gray-600 mb-8'>
                  Please wait while we process your payment and confirm your order...
                </p>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-shop_dark_green h-2 rounded-full animate-pulse' style={{width: '60%'}}></div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white/95 backdrop-blur-md border border-gray-100/50 rounded-3xl shadow-2xl sticky top-8'>
              <div className='px-8 py-6 border-b border-gray-100/50'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center'>
                  <div className='w-8 h-8 bg-gradient-to-r from-shop_dark_green to-shop_light_green rounded-full flex items-center justify-center mr-3'>
                    <Package className='w-4 h-4 text-white' />
                  </div>
                  Order Summary
                </h2>
              </div>
              
              {/* Cart Items */}
              <div className='px-8 py-6 border-b border-gray-100/50 max-h-64 overflow-y-auto'>
                {cartItems.map((item) => {
                  const currentItem = item.itemType === 'product' ? item.product : item.deal
                  const itemId = item.itemType === 'product' ? item.product?.id : item.deal?.id
                  
                  return (
                  <div key={`${item.itemType}-${itemId}`} className='flex items-center gap-3 mb-4'>
                    <div className='w-12 h-12 bg-gray-200 rounded flex-shrink-0 relative overflow-hidden'>
                      {/* Use CSS background image for product image */}
                      <div 
                        className='w-full h-full bg-cover bg-center'
                        style={{
                          backgroundImage: `url(${
                            item.itemType === 'product' 
                              ? (item.product?.image || '/api/placeholder/400/300')
                              : (item.deal?.images?.[0] || item.deal?.image || '/api/placeholder/400/300')
                          })`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#f3f4f6'
                        }}
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium text-gray-900 line-clamp-1'>
                        {item.itemType === 'product' ? item.product?.name : item.deal?.title}
                      </h4>
                      <p className='text-xs text-gray-500'>Qty: {item.quantity}</p>
                    </div>
                    <span className='text-sm font-semibold text-gray-900'>
                      ৳{((item.itemType === 'product' ? item.product?.price : item.deal?.dealPrice) || 0) * item.quantity}.toFixed(1)
                    </span>
                  </div>
                  )
                })}
              </div>

              {/* Price Breakdown */}
              <div className='px-8 py-6 space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600 text-sm'>Subtotal</span>
                  <span className='font-medium text-gray-900 text-lg'>৳{subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className='flex justify-between items-center'>
                    <span className='text-green-600 text-sm'>Discount</span>
                    <span className='font-medium text-green-600 text-lg'>-৳{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600 text-sm'>Shipping</span>
                  <span className='font-medium text-gray-900 text-lg'>
                    {shipping === 0 ? (subtotal >= 10000 ? 'FREE (Order ≥ ৳10,000)' : 'FREE (Dhaka)') : `৳${shipping.toFixed(1)} (Outside Dhaka)`}
                  </span>
                </div>
                
                {appliedCoupon && (
                  <div className='flex justify-between items-center text-xs text-green-600 bg-green-50 p-2 rounded'>
                    <span>Coupon: {appliedCoupon.code}</span>
                    <span>৳{discount.toFixed(2)} off</span>
                  </div>
                )}
                
                <div className='border-t border-gray-200 pt-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xl font-bold text-gray-900 tracking-wide'>Total</span>
                    <span className='text-2xl font-bold text-shop_dark_green tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-shop_dark_green via-shop_light_green to-shop_dark_green bg-clip-text'>
                      ৳{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className='px-8 py-6 border-t border-gray-100/50'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-xl'>
                    <Truck className='w-6 h-6 text-gray-600' />
                    <div className='text-sm text-gray-700 leading-relaxed'>
                      <span className='font-medium'>
                        {shipping === 0 ? (
                          subtotal >= 10000 ? '✅ Free shipping on orders ৳10,000 or more!' : '✅ Free shipping within Dhaka'
                        ) : (
                          `৳120 shipping charge applied (outside Dhaka). Add ৳${(10000 - subtotal).toFixed(1)} more for free shipping!`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
