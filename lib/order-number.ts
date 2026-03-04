// Order number generation utility

export function generateOrderNumber() {
  // Generate order number in format: ORD-last 2 digit of year + first 2 letter product name + 3 digit number
  const currentYear = new Date().getFullYear()
  const lastTwoDigitsYear = currentYear.toString().slice(-2)
  const productName = 'PR' // Default product name (can be made dynamic)
  const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${lastTwoDigitsYear}${productName}${randomNumber}`
}
