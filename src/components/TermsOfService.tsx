import React from 'react';
import { X } from 'lucide-react';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
          <div className="prose max-w-none">
            <p className="text-sm text-gray-500 mb-6">Last updated: January 2025</p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h3>
            <p className="text-gray-700 mb-6">
              By accessing and using the OK Industries catalog website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Catalog Nature</h3>
            <p className="text-gray-700 mb-6">
              This website serves as a product catalog for informational purposes only. All product listings, prices, and availability are subject to change without notice. This catalog does not constitute a binding offer to sell.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Product Information</h3>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate product information, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Product descriptions and specifications</li>
              <li>Pricing in Czech Koruna (CZK)</li>
              <li>Stock availability status</li>
              <li>Product images and technical details</li>
            </ul>
            <p className="text-gray-700 mb-6">
              However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Order Inquiries</h3>
            <p className="text-gray-700 mb-6">
              Order submissions through this catalog are inquiries only and do not constitute binding purchase orders. All orders are subject to confirmation, availability, and our acceptance. We reserve the right to refuse or cancel any order at our discretion.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Pricing and Availability</h3>
            <p className="text-gray-700 mb-6">
              All prices are listed in Czech Koruna (CZK) and are subject to change without notice. Stock availability is updated regularly but may not reflect real-time inventory levels. Products marked as "Coming Soon" are not available for immediate order.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">6. Intellectual Property</h3>
            <p className="text-gray-700 mb-6">
              All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of OK Industries and is protected by copyright and other intellectual property laws.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">7. Limitation of Liability</h3>
            <p className="text-gray-700 mb-6">
              OK Industries shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this catalog website or any products listed herein.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">8. Contact Information</h3>
            <p className="text-gray-700 mb-6">
              For questions about these Terms of Service or to place actual orders, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>OK Industries</strong><br />
                Email: info@okindustries.cz<br />
                Phone: +420 123 456 789<br />
                Address: Prague, Czech Republic
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">9. Changes to Terms</h3>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this website. Your continued use of the catalog constitutes acceptance of any changes.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">10. Governing Law</h3>
            <p className="text-gray-700 mb-6">
              These terms shall be governed by and construed in accordance with the laws of the Czech Republic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;