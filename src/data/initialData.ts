import { Product } from '../types/Product';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Arduino Uno R3',
    price: 450,
    category: 'microcontrollers',
    quantity: 25,
    image: 'https://images.pexels.com/photos/442152/pexels-photo-442152.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    description: 'Arduino Uno R3 microcontroller board based on the ATmega328P. Perfect for beginners and advanced projects.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Resistor Kit 1/4W',
    price: 120,
    category: 'resistors',
    quantity: 50,
    image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    description: 'Complete resistor kit with various values from 1Ω to 1MΩ. High quality 1/4W metal film resistors.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'LED Diode Pack',
    price: 85,
    category: 'diodes',
    quantity: 0,
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    description: 'Mixed pack of 5mm LEDs in various colors. Red, green, blue, yellow, and white included.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Ultrasonic Sensor HC-SR04',
    price: 65,
    category: 'sensors',
    quantity: -1,
    image: 'https://images.pexels.com/photos/343457/pexels-photo-343457.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    description: 'Ultrasonic ranging module HC-SR04 provides 2cm-400cm ranging function with high accuracy.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Ceramic Capacitor Set',
    price: 95,
    category: 'capacitors',
    quantity: 30,
    image: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    description: 'Ceramic capacitor assortment with various capacitance values. High-quality multilayer ceramic capacitors.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Jumper Wire Kit',
    price: 45,
    category: 'wires',
    quantity: 100,
    image: 'https://images.pexels.com/photos/442152/pexels-photo-442152.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1',
    description: 'Complete jumper wire kit with male-to-male, male-to-female, and female-to-female connections.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];