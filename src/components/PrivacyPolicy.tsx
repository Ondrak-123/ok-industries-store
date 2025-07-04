import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
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
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Information We Collect</h3>
            <p className="text-gray-700 mb-4">
              OK Industries collects information you provide directly to us, such as when you:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Browse our product catalog</li>
              <li>Submit order inquiries through our contact forms</li>
              <li>Contact us for customer support</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. How We Use Your Information</h3>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Process and respond to your inquiries</li>
              <li>Provide customer support</li>
              <li>Improve our products and services</li>
              <li>Communicate with you about our products and services</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Information Sharing</h3>
            <p className="text-gray-700 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Data Storage</h3>
            <p className="text-gray-700 mb-6">
              This catalog website stores information locally in your browser. No personal data is transmitted to external servers except for order inquiry emails sent through our contact system.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Cookies and Local Storage</h3>
            <p className="text-gray-700 mb-6">
              Our website uses local storage to enhance your browsing experience by remembering your preferences and cart contents. This information is stored locally on your device and is not transmitted to our servers.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">6. Security</h3>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">7. Contact Information</h3>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>OK Industries</strong><br />
                Email: info@okindustries.cz<br />
                Phone: +420 123 456 789<br />
                Address: Prague, Czech Republic
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">8. Changes to This Policy</h3>
            <p className="text-gray-700 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;