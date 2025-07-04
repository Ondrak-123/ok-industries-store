import React from 'react';
import { Printer, Cpu } from 'lucide-react';
import { StoreSettings } from '../types/Product';

interface ServiceBannersProps {
  settings: StoreSettings;
}

const ServiceBanners: React.FC<ServiceBannersProps> = ({ settings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {/* 3D Printing Services */}
      <div className="relative rounded-lg overflow-hidden shadow-lg group">
        <img
          src={settings.banners.printing3d || 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1'}
          alt="3D Printing Services"
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center mb-2">
              <Printer className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-bold">
                {settings.content?.printing3dTitle || 'Professional 3D Printing Services'}
              </h3>
            </div>
            <p className="text-sm text-gray-200">
              {settings.content?.printing3dDescription || 'High-quality 3D printing services for prototypes, custom parts, and small-scale production.'}
            </p>
          </div>
        </div>
      </div>

      {/* PCB Manufacturing */}
      <div className="relative rounded-lg overflow-hidden shadow-lg group">
        <img
          src={settings.banners.pcbManufacturing || 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1'}
          alt="PCB Manufacturing"
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center mb-2">
              <Cpu className="h-6 w-6 mr-2" />
              <h3 className="text-xl font-bold">
                {settings.content?.pcbTitle || 'Custom PCB Manufacturing'}
              </h3>
            </div>
            <p className="text-sm text-gray-200">
              {settings.content?.pcbDescription || 'Professional PCB design and manufacturing services from prototype to production.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBanners;