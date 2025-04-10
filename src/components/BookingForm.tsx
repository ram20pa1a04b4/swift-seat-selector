
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Seat } from '@/types';
import { findBestAvailableSeats } from '@/utils/seatUtils';

interface BookingFormProps {
  seats: Seat[];
  onSeatsSelected: (selectedSeats: Seat[]) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ seats, onSeatsSelected }) => {
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [numSeats, setNumSeats] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic form validation
    if (!passengerName.trim() || !passengerEmail.trim() || !numSeats) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passengerEmail)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const seatCount = parseInt(numSeats, 10);
    
    // Find the best available seats based on our algorithm
    const bestSeats = findBestAvailableSeats(seats, seatCount);

    if (bestSeats.length < seatCount) {
      toast({
        title: 'Insufficient seats',
        description: `Not enough consecutive seats available for ${seatCount} passengers. Please select a smaller number.`,
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Seats found!',
        description: `We've found ${seatCount} ideal seats for you. Please review and confirm.`,
      });
      
      // Pass the selected seats up to the parent component
      onSeatsSelected(bestSeats);
      
      // Reset form
      setPassengerName('');
      setPassengerEmail('');
    }, 1000);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Book Your Seats</CardTitle>
        <CardDescription>
          Enter your details and how many seats you need
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passenger-name">Passenger Name</Label>
            <Input
              id="passenger-name"
              placeholder="Enter your full name"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passenger-email">Email</Label>
            <Input
              id="passenger-email"
              type="email"
              placeholder="Enter your email"
              value={passengerEmail}
              onChange={(e) => setPassengerEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="num-seats">Number of Seats</Label>
            <Select
              value={numSeats}
              onValueChange={setNumSeats}
            >
              <SelectTrigger id="num-seats">
                <SelectValue placeholder="Select number of seats" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'seat' : 'seats'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum 7 seats per booking
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Searching best seats...' : 'Find Best Available Seats'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BookingForm;
