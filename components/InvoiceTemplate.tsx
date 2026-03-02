'use client'

import React from 'react'

interface InvoiceTemplateProps {
  orderDetails: {
    orderNumber: string
    amount: number
    items: number
    paymentMethod: string
    estimatedDelivery: string
    customerEmail: string
  }
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ orderDetails }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div id="invoice-template" className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p className="text-gray-600">Invoice #: {orderDetails.orderNumber}</p>
            <p className="text-gray-600">Date: {currentDate}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-shop_dark_green">MK Shop BD</h2>
            <p className="text-gray-600">Your Trusted E-Commerce Partner</p>
            <p className="text-gray-600">support@mkshopbd.com</p>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-3">BILL TO:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold">{orderDetails.customerEmail}</p>
            <p className="text-gray-600">Customer</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-3">PAYMENT METHOD:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold">{orderDetails.paymentMethod}</p>
            <p className="text-gray-600">Paid Successfully</p>
          </div>
        </div>
      </div>

      {/* Order Details Table */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3">ORDER DETAILS</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Quantity</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Unit Price</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Purchased Items</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{orderDetails.items}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                ৳{(orderDetails.amount / orderDetails.items).toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                ৳{orderDetails.amount.toFixed(2)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right font-bold">
                TOTAL AMOUNT:
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right font-bold text-xl">
                ৳{orderDetails.amount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Delivery Information */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-3">DELIVERY INFORMATION</h3>
          <div className="bg-blue-50 p-4 rounded">
            <p className="font-semibold text-blue-900">Estimated Delivery</p>
            <p className="text-blue-700">{orderDetails.estimatedDelivery}</p>
            <p className="text-sm text-blue-600 mt-2">Order will be processed within 24 hours</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-3">ORDER STATUS</h3>
          <div className="bg-green-50 p-4 rounded">
            <p className="font-semibold text-green-900">Payment Confirmed</p>
            <p className="text-green-700">Processing</p>
            <p className="text-sm text-green-600 mt-2">Thank you for your purchase!</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-800 pt-6 mt-8">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Thank you for shopping with MK Shop BD!</p>
          <p className="text-sm text-gray-500">
            This is a computer-generated invoice and does not require a signature.
          </p>
          <p className="text-sm text-gray-500">
            For any inquiries, please contact our customer support.
          </p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceTemplate
