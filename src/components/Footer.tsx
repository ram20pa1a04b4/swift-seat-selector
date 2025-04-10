
import React from 'react';
import { Train } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Train className="h-6 w-6 text-train-primary" />
            <h2 className="text-lg font-bold">Train Seat Reservation</h2>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="hover:text-train-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-train-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-train-primary transition-colors">Help</a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Train Seat Reservation System. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">
            This is a demonstration project. Not affiliated with any actual train service.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
