import React, { useState } from 'react';
import { Mail, Phone, MapPin, Info } from 'lucide-react';
import { StoreSettings } from '../types/Product';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

interface FooterProps {
  settings: StoreSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Catalog Disclaimer */}
          <div className="bg-blue-900 bg-opacity-50 rounded-lg p-6 mb-8 border border-blue-700">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-blue-300 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-blue-100 mb-2">Catalog Notice</h3>
                <p className="text-blue-200 leading-relaxed">
                  This website serves as a product catalog for informational purposes only. All product listings, 
                  prices, and availability are subject to change without notice. Order submissions through this 
                  catalog are inquiries only and do not constitute binding purchase orders. Please contact us 
                  directly to confirm availability and place actual orders.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">OK Industries</h3>
              <p className="text-gray-300 mb-4">
                Your trusted partner for electronic components and tools. 
                Browse our comprehensive catalog of quality electronic products and components.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{settings.contact.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{settings.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{settings.contact.address}</span>
                </div>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsTermsOpen(true)}
                  className="text-gray-300 hover:text-white block transition-colors text-left"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setIsPrivacyOpen(true)}
                  className="text-gray-300 hover:text-white block transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© OK Industries. All Rights Reserved. Copyright 2025</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
};

export default Footer;