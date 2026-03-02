'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { CheckCircle, Package, Truck, CreditCard, ArrowRight, Download, Home, ShoppingBag, MapPin, Clock, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const PaymentConfirmationContent = () => {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: '',
    amount: 0,
    items: 0,
    paymentMethod: '',
    estimatedDelivery: '',
    customerEmail: '',
    customerAddress: '',
    customerDistrict: '',
    products: [] as any[]
  })

  useEffect(() => {
    setMounted(true)
    
    // Generate order number in new format: ORD-last 2 digit of year + first 2 letter product name + 3 digit number
    const currentYear = new Date().getFullYear()
    const lastTwoDigitsYear = currentYear.toString().slice(-2)
    const productName = 'PR' // Default product name (can be made dynamic)
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const orderId = `ORD-${lastTwoDigitsYear}${productName}${randomNumber}`
    const amount = searchParams?.get('amount') || '0'
    const items = searchParams?.get('items') || '0'
    const paymentMethod = searchParams?.get('method') || 'Card'
    
    setOrderDetails({
      orderNumber: orderId,
      amount: parseFloat(amount) || 0,
      items: parseInt(items) || 0,
      paymentMethod: paymentMethod,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      customerEmail: searchParams?.get('email') || 'customer@example.com',
      customerAddress: searchParams?.get('address') || '123 Main Street, Dhaka',
      customerDistrict: searchParams?.get('district') || 'Dhaka',
      products: [
        {
          name: 'Premium T-Shirt',
          price: 29.99,
          quantity: 1
        },
        {
          name: 'Classic Jeans',
          price: 49.99,
          quantity: 1
        },
        {
          name: 'Sports Shoes',
          price: 69.99,
          quantity: 1
        }
      ]
    })
  }, [searchParams])

  const downloadReceipt = async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
      // Fallback for server-side rendering
      alert('Receipt download is only available on client-side. Please use a desktop browser.')
      return
    }

    setIsGeneratingPDF(true)

    try {
      console.log('Starting PDF generation with jsPDF...')
      
      // Create PDF document
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      // Page dimensions
      const pageWidth = 210
      const margin = 15
      const contentWidth = pageWidth - (margin * 2)
      let yPosition = margin
      
      // Set font
      pdf.setFont('helvetica')
      
      // Header box
      pdf.setDrawColor(17, 60, 40) // Dark green border
      pdf.setFillColor(248, 252, 248) // Light green background
      pdf.rect(margin, yPosition, contentWidth, 35, 'FD')
      yPosition += 8
      
      // Title
      pdf.setFontSize(24)
      pdf.setTextColor(17, 60, 40) // Dark green
      pdf.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10
      
      // Company info
      pdf.setFontSize(11)
      pdf.setTextColor(75, 85, 99) // Gray
      pdf.text('MK Shop BD', pageWidth / 2, yPosition, { align: 'center' })
      pdf.text('Your Trusted E-Commerce Partner', pageWidth / 2, yPosition + 5, { align: 'center' })
      yPosition += 15
      
      // Order info box
      pdf.setDrawColor(200, 200, 200) // Light gray border
      pdf.setFillColor(255, 255, 255) // White background
      pdf.rect(margin, yPosition, contentWidth, 20, 'FD')
      yPosition += 6
      
      pdf.setFontSize(9)
      pdf.setTextColor(75, 85, 99) // Gray
      pdf.text(`Invoice #: ${orderDetails.orderNumber}`, margin + 3, yPosition)
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, margin + 3, yPosition + 5)
      pdf.text(`Payment Method: ${orderDetails.paymentMethod}`, margin + 3, yPosition + 10)
      yPosition += 18
      
      // Bill to section
      pdf.setDrawColor(200, 200, 200) // Light gray border
      pdf.setFillColor(248, 252, 248) // Light green background
      pdf.rect(margin, yPosition, contentWidth, 35, 'FD')
      yPosition += 6
      
      pdf.setFontSize(11)
      pdf.setTextColor(17, 60, 40) // Dark green
      pdf.text('BILL TO:', margin + 3, yPosition)
      yPosition += 6
      
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0) // Black
      pdf.text(orderDetails.customerEmail, margin + 3, yPosition)
      pdf.text(orderDetails.customerAddress, margin + 3, yPosition + 5)
      pdf.text(orderDetails.customerDistrict, margin + 3, yPosition + 10)
      pdf.text('Customer', margin + 3, yPosition + 15)
      yPosition += 20
      
      // Order details section
      pdf.setFontSize(12)
      pdf.setTextColor(17, 60, 40) // Dark green
      pdf.text('ORDER DETAILS', margin, yPosition)
      yPosition += 8
      
      // Table setup
      const tableStartX = margin
      const tableWidth = contentWidth
      const colWidths = [0.4, 0.15, 0.15, 0.3] // Description, Quantity, Unit, Price
      
      // Table header
      pdf.setDrawColor(17, 60, 40) // Dark green border
      pdf.setFillColor(17, 60, 40) // Dark green background
      pdf.rect(tableStartX, yPosition, tableWidth, 8, 'FD')
      
      pdf.setFontSize(9)
      pdf.setTextColor(255, 255, 255) // White
      pdf.text('Description', tableStartX + 3, yPosition + 5)
      pdf.text('Quantity', tableStartX + (tableWidth * colWidths[0]) + 2, yPosition + 5)
      pdf.text('Unit', tableStartX + (tableWidth * (colWidths[0] + colWidths[1])) + 2, yPosition + 5)
      pdf.text('Price', tableStartX + (tableWidth * (colWidths[0] + colWidths[1] + colWidths[2])) + 2, yPosition + 5)
      yPosition += 8
      
      // Table data rows - display each product
      orderDetails.products.forEach((product, index) => {
        pdf.setDrawColor(200, 200, 200) // Light gray border
        pdf.setFillColor(255, 255, 255) // White background
        pdf.rect(tableStartX, yPosition, tableWidth, 8, 'FD')
        
        pdf.setFontSize(9)
        pdf.setTextColor(0, 0, 0) // Black
        pdf.text(product.name, tableStartX + 3, yPosition + 5)
        pdf.text(`${product.quantity}`, tableStartX + (tableWidth * colWidths[0]) + 2, yPosition + 5)
        pdf.text(`${product.quantity}`, tableStartX + (tableWidth * (colWidths[0] + colWidths[1])) + 2, yPosition + 5)
        pdf.text(`T.K ${product.price.toFixed(2)}`, tableStartX + (tableWidth * (colWidths[0] + colWidths[1] + colWidths[2])) + 2, yPosition + 5)
        yPosition += 8
      })
      
      // Total row - calculate from all unit prices
      const grandTotal = orderDetails.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
      pdf.setDrawColor(17, 60, 40) // Dark green border
      pdf.setFillColor(248, 252, 248) // Light green background
      pdf.rect(tableStartX, yPosition, tableWidth, 10, 'FD')
      
      pdf.setFontSize(10)
      pdf.setTextColor(17, 60, 40) // Dark green
      pdf.text('TOTAL AMOUNT:', tableStartX + 3, yPosition + 6)
      pdf.setFontSize(12)
      pdf.text(`T.K ${grandTotal.toFixed(2)}`, tableStartX + (tableWidth * 0.7) + 2, yPosition + 6)
      yPosition += 20
      
      // Two column layout for delivery and status
      const colWidth = (contentWidth - 5) / 2
      
      // Delivery info box
      pdf.setDrawColor(59, 130, 246) // Blue border
      pdf.setFillColor(239, 246, 255) // Light blue background
      pdf.rect(margin, yPosition, colWidth, 30, 'FD')
      yPosition += 6
      
      pdf.setFontSize(10)
      pdf.setTextColor(30, 58, 138) // Blue
      pdf.text('DELIVERY INFORMATION', margin + 3, yPosition)
      yPosition += 5
      
      pdf.setFontSize(8)
      pdf.setTextColor(0, 0, 0) // Black
      pdf.text('Estimated Delivery:', margin + 3, yPosition)
      pdf.text(orderDetails.estimatedDelivery, margin + 3, yPosition + 5)
      pdf.text('Order processed within 24 hours', margin + 3, yPosition + 10)
      
      // Order status box (positioned next to delivery)
      pdf.setDrawColor(34, 197, 94) // Green border
      pdf.setFillColor(240, 253, 244) // Light green background
      pdf.rect(margin + colWidth + 5, yPosition - 24, colWidth, 30, 'FD')
      
      pdf.setFontSize(10)
      pdf.setTextColor(22, 163, 74) // Green
      pdf.text('ORDER STATUS', margin + colWidth + 8, yPosition - 18)
      
      pdf.setFontSize(8)
      pdf.setTextColor(0, 0, 0) // Black
      pdf.text('Payment Confirmed', margin + colWidth + 8, yPosition - 11)
      pdf.text('Processing', margin + colWidth + 8, yPosition - 6)
      pdf.text('Thank you for your purchase!', margin + colWidth + 8, yPosition - 1)
      yPosition += 15
      
      // Footer
      pdf.setDrawColor(200, 200, 200) // Light gray border
      pdf.setFillColor(248, 252, 248) // Light green background
      pdf.rect(margin, yPosition, contentWidth, 20, 'FD')
      yPosition += 6
      
      pdf.setFontSize(8)
      pdf.setTextColor(75, 85, 99) // Gray
      pdf.text('Thank you for shopping with MK Shop BD!', pageWidth / 2, yPosition, { align: 'center' })
      pdf.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, yPosition + 5, { align: 'center' })
      pdf.text('For any inquiries, please contact our customer support.', pageWidth / 2, yPosition + 10, { align: 'center' })
      
      // Generate PDF blob
      const pdfBlob = pdf.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      
      // Create download link
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      downloadLink.download = `invoice-${orderDetails.orderNumber}.pdf`
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      
      // Trigger download
      downloadLink.click()
      
      // Clean up
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(url)
      
      console.log('PDF download triggered successfully')
      alert('PDF invoice downloaded successfully!')
      
    } catch (error: any) {
      console.error('Error generating receipt:', error)
      alert(`Failed to generate receipt: ${error?.message || 'Unknown error'}`)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Don't render until mounted on client side
  if (!mounted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-shop_light_bg to-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-shop_dark_green mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-shop_light_bg to-white py-8 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Success Message */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4'>
            <CheckCircle className='w-10 h-10 text-green-600' />
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>
            Payment <span className='text-green-600'>Successful!</span>
          </h1>
          <p className='text-lg text-gray-600'>
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        {/* Order Details Card */}
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6'>
          <div className='border-b border-gray-200 pb-6 mb-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Order Details</h2>
            
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Order Number</p>
                <p className='text-lg font-semibold text-gray-900'>{orderDetails.orderNumber}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Payment Method</p>
                <p className='text-lg font-semibold text-gray-900'>{orderDetails.paymentMethod}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Total Amount</p>
                <p className='text-2xl font-bold text-shop_dark_green'>৳{orderDetails.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Items Purchased</p>
                <p className='text-lg font-semibold text-gray-900'>{orderDetails.items} items</p>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-shop_light_green/10 rounded-lg flex items-center justify-center'>
                <Truck className='w-6 h-6 text-shop_dark_green' />
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Estimated Delivery</p>
                <p className='text-lg font-semibold text-gray-900'>{orderDetails.estimatedDelivery}</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-shop_orange/10 rounded-lg flex items-center justify-center'>
                <Package className='w-6 h-6 text-shop_orange' />
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Order Status</p>
                <p className='text-lg font-semibold text-green-600'>Processing</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className='bg-gray-50 rounded-xl p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-10 h-10 bg-shop_dark_green/10 rounded-lg flex items-center justify-center'>
                <CreditCard className='w-5 h-5 text-shop_dark_green' />
              </div>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Billing Email</p>
                <p className='text-lg font-semibold text-gray-900'>{orderDetails.customerEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button
            onClick={downloadReceipt}
            disabled={isGeneratingPDF}
            className='flex items-center gap-2 bg-shop_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_btn_dark_green hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isGeneratingPDF ? (
              <>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                Generating PDF...
              </>
            ) : (
              <>
                <Download className='w-5 h-5' />
                Download Receipt
              </>
            )}
          </button>
          
          <Link
            href='/shop'
            className='flex items-center gap-2 bg-white border-2 border-shop_dark_green text-shop_dark_green px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:text-white transition-all duration-300'
          >
            <ShoppingBag className='w-5 h-5' />
            Continue Shopping
          </Link>
          
          <Link
            href='/account/orders'
            className='flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300'
          >
            <Package className='w-5 h-5' />
            View Orders
          </Link>
        </div>
      </div>

      {/* Payment Tracking Section */}
      <div className='mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
          <MapPin className='w-6 h-6 text-shop_dark_green' />
          Payment Tracking
        </h3>
        
        <div className='grid md:grid-cols-2 gap-6 mb-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
              <CheckCircle className='w-6 h-6 text-green-600' />
            </div>
            <div>
              <p className='font-semibold text-gray-900 mb-1'>Payment Status</p>
              <p className='text-lg text-green-600 font-bold'>Completed</p>
              <p className='text-sm text-gray-600'>Transaction verified and confirmed</p>
            </div>
          </div>
          
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
              <Truck className='w-6 h-6 text-blue-600' />
            </div>
            <div>
              <p className='font-semibold text-gray-900 mb-1'>Shipping Status</p>
              <p className='text-lg text-orange-600 font-bold'>Processing</p>
              <p className='text-sm text-gray-600'>Order will be shipped within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className='border-t border-gray-200 pt-6'>
          <h4 className='text-lg font-semibold text-gray-900 mb-4'>Order Timeline</h4>
          <div className='space-y-4'>
            <div className='flex items-start gap-4'>
              <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <CheckCircle className='w-4 h-4 text-green-600' />
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-gray-900'>Order Placed</p>
                <p className='text-sm text-gray-600'>{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            
            <div className='flex items-start gap-4'>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <CreditCard className='w-4 h-4 text-blue-600' />
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-gray-900'>Payment Confirmed</p>
                <p className='text-sm text-gray-600'>{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            
            <div className='flex items-start gap-4 opacity-60'>
              <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Package className='w-4 h-4 text-gray-600' />
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-gray-900'>Shipped</p>
                <p className='text-sm text-gray-600'>Expected: {orderDetails.estimatedDelivery}</p>
              </div>
            </div>
            
            <div className='flex items-start gap-4 opacity-40'>
              <div className='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0'>
                <Truck className='w-4 h-4 text-gray-600' />
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-gray-900'>Delivered</p>
                <p className='text-sm text-gray-600'>Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className='mt-6 text-center'>
          <button
            onClick={() => window.location.reload()}
            className='inline-flex items-center gap-2 bg-shop_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_btn_dark_green hover:shadow-lg transition-all duration-300'
          >
            <RefreshCw className='w-5 h-5' />
            Refresh Status
          </button>
        </div>
      </div>

      {/* Additional Information */}
      <div className='mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-4'>What's Next?</h3>
        <div className='space-y-4'>
          <div className='flex items-start gap-3'>
            <CheckCircle className='w-5 h-5 text-green-600 flex-shrink-0 mt-1' />
            <div>
              <p className='font-semibold text-gray-900 mb-1'>Order Confirmation</p>
              <p className='text-gray-600'>You'll receive an email confirmation shortly with all order details.</p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <Truck className='w-5 h-5 text-shop_dark_green flex-shrink-0 mt-1' />
            <div>
              <p className='font-semibold text-gray-900 mb-1'>Shipping Process</p>
              <p className='text-gray-600'>Your order will be processed within 24 hours and shipped within 2-3 business days.</p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <Package className='w-5 h-5 text-shop_orange flex-shrink-0 mt-1' />
            <div>
              <p className='font-semibold text-gray-900 mb-1'>Track Your Order</p>
              <p className='text-gray-600'>Use your order number to track package status in real-time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className='mt-8 text-center'>
        <p className='text-gray-600 mb-4'>Need help with your order?</p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            href='/contact'
            className='flex items-center gap-2 bg-shop_light_pink text-shop_dark_green px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:text-white transition-all duration-300'
          >
            Contact Support
            <ArrowRight className='w-4 h-4' />
          </Link>
          <Link
            href='/faq'
            className='flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300'
          >
            View FAQ
            <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </div>
  )
}

const PaymentConfirmation = () => {
  return (
    <Suspense fallback={
      <div className='min-h-screen bg-gradient-to-br from-shop_light_bg to-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-shop_dark_green mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading confirmation...</p>
        </div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  )
}

export default PaymentConfirmation
