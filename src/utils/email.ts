import emailjs from '@emailjs/browser';

export const sendOrderEmail = async (orderData: any) => {
  try {
    // Initialize EmailJS with your public key
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

    const templateParams = {
      customer_name: orderData.customerName,
      order_id: orderData.id,
      order_total: orderData.total,
      order_items: orderData.items.map((item: any) => 
        `${item.product.name} x${item.quantity} - ${formatPrice(item.product.price * item.quantity)}`
      ).join('\n'),
      to_email: 'ondrak123k@gmail.com'
    };

    const response = await emailjs.send(
      'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
      templateParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('cs-CZ', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })} CZK`;
};

export const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};