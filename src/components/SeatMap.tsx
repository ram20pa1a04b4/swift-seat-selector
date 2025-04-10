
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Seat } from '@/types';
import { organizeSeatsByRow, updateSeatStatus, countAvailableSeats } from '@/utils/seatUtils';
import { useToast } from '@/components/ui/use-toast';
import { Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SeatMapProps {
  seats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  onSeatDeselect: (seat: Seat) => void;
  onBookingConfirm: () => void;
  selectedSeats: Seat[];
}

const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  onSeatSelect,
  onSeatDeselect,
  onBookingConfirm,
  selectedSeats,
}) => {
  const [seatsByRow, setSeatsByRow] = useState<Seat[][]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Organize seats by row for display
    const organizedSeats = organizeSeatsByRow(seats);
    setSeatsByRow(organizedSeats);
  }, [seats]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') {
      // Seat is already booked, do nothing
      toast({
        title: 'Seat unavailable',
        description: 'This seat is already booked.',
        variant: 'destructive',
      });
      return;
    }

    if (seat.status === 'selected') {
      // Seat is already selected, deselect it
      onSeatDeselect(seat);
      return;
    }

    // Check if already selected 7 seats (maximum)
    if (selectedSeats.length >= 7) {
      toast({
        title: 'Maximum seats selected',
        description: 'You can only select up to 7 seats per booking.',
        variant: 'destructive',
      });
      return;
    }

    // Seat is available, select it
    onSeatSelect(seat);
  };

  const availableSeatsCount = countAvailableSeats(seats);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Train Seat Selection</CardTitle>
        <CardDescription>
          Select up to 7 seats for your journey
        </CardDescription>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="seat-available seat w-8 h-8 mr-2">A</div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="seat-selected seat w-8 h-8 mr-2">S</div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="seat-booked seat w-8 h-8 mr-2">B</div>
            <span className="text-sm">Booked</span>
          </div>
        </div>
        
        <Alert className="mt-4 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertTitle>Train Information</AlertTitle>
          <AlertDescription>
            Available seats: {availableSeatsCount}/{seats.length}
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[580px] py-4">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-train-primary text-white py-2 px-6 rounded-md font-medium">
                DRIVER CABIN
              </div>
            </div>

            <div className="space-y-6">
              {seatsByRow.map((row, rowIndex) => (
                <div 
                  key={`row-${rowIndex}`} 
                  className="flex justify-center items-center gap-2"
                >
                  <div className="w-8 h-8 flex items-center justify-center font-medium">
                    R{rowIndex + 1}
                  </div>
                  <div className={`flex flex-wrap justify-center ${rowIndex === 11 ? 'w-44' : 'w-full'}`}>
                    {row.map((seat) => (
                      <div
                        key={`seat-${seat.id}`}
                        className={`seat ${
                          seat.status === 'available'
                            ? 'seat-available'
                            : seat.status === 'selected'
                            ? 'seat-selected'
                            : 'seat-booked'
                        }`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat.row}-{seat.seatNumber}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center mt-8">
              <div className="bg-gray-200 w-2/3 h-2 rounded-full"></div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <div className="text-lg font-medium">
          Selected Seats: {selectedSeats.length > 0 
            ? selectedSeats.map(seat => `${seat.row}-${seat.seatNumber}`).join(', ')
            : 'None'}
        </div>
        
        {selectedSeats.length === 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No seats selected</AlertTitle>
            <AlertDescription>
              Please select at least one seat to continue with your booking.
            </AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={onBookingConfirm}
          disabled={selectedSeats.length === 0}
          className="w-full"
        >
          Confirm Booking
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SeatMap;
