
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-train-primary">Train Seat Reservation</h1>
        <p className="text-lg text-gray-600 mb-6">
          Welcome to our train seat reservation system. Book your seats easily and manage your bookings.
        </p>
        <Button 
          className="w-full" 
          onClick={() => navigate('/home')}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
