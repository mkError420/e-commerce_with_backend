import React from 'react'

const WhatsAppButton = () => {
  const phoneNumber = "8801572491828"; // Bangladesh country code (880) + number without leading 0
  const message = "Hello! I'm interested in your products.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M12.043 23.657a11.937 11.937 0 01-5.716-1.453L0 24l1.795-6.318A11.936 11.936 0 0112.043 0C18.665 0 24.043 5.378 24.043 12s-5.378 12-12 12zm6.848-9.795c-.375-.187-2.211-1.091-2.553-1.215-.342-.124-.59-.187-.839.187-.248.374-.962 1.215-1.18 1.463-.218.248-.436.279-.811.093-.375-.186-1.583-.584-3.016-1.861-1.115-.994-1.867-2.222-2.085-2.597-.218-.375-.023-.578.165-.764.169-.167.375-.435.562-.653.188-.218.249-.374.374-.623.124-.248.062-.466-.031-.653-.094-.187-.839-2.022-1.149-2.77-.302-.727-.608-.629-.839-.64-.218-.01-.467-.012-.716-.012-.249 0-.653.094-.995.466-.342.374-1.305 1.274-1.305 3.107 0 1.833 1.336 3.603 1.523 3.851.187.248 2.631 4.018 6.376 5.637.891.384 1.587.613 2.131.785.895.284 1.71.244 2.354.148.718-.104 2.211-.904 2.523-1.777.312-.873.312-1.62.218-1.777-.094-.156-.343-.249-.718-.435z"/>
      </svg>
    </a>
  )
}

export default WhatsAppButton
