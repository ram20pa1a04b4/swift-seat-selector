
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import AuthForm from '@/components/AuthForm';
import SeatMap from '@/components/SeatMap';
import BookingForm from '@/components/BookingForm';
import UserBookings from '@/components/UserBookings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Booking, Seat, User } from '@/types';
import { generateSeatMap, updateSeatStatus } from '@/utils/seatUtils';
import { v4 as uuidv4 } from 'uuid';

const HomePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('book');
  const { toast } = useToast();

  useEffect(() => {
    // Generate initial seat map
    const initialSeats = generateSeatMap();
    setSeats(initialSeats);

    // For demo purposes, let's pre-book some seats
    if (initialSeats.length > 0) {
      const randomSeatIds = Array.from({ length: 15 }, () => 
        Math.floor(Math.random() * initialSeats.length) + 1
      );
      const updatedSeats = updateSeatStatus(
        initialSeats,
        randomSeatIds,
        'booked',
        'demo-user',
        'demo-booking'
      );
      setSeats(updatedSeats);
    }
  }, []);

  const handleAuthenticated = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedSeats([]);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  const handleSeatSelect = (seat: Seat) => {
    // Update the selected seat status
    const updatedSeats = updateSeatStatus([seat], [seat.id], 'selected');
    setSeats((prevSeats) =>
      prevSeats.map((prevSeat) =>
        prevSeat.id === seat.id ? updatedSeats[0] : prevSeat
      )
    );
    setSelectedSeats((prev) => [...prev, { ...seat, status: 'selected' }]);
  };

  const handleSeatDeselect = (seat: Seat) => {
    // Update the deselected seat status back to available
    const updatedSeats = updateSeatStatus([seat], [seat.id], 'available');
    setSeats((prevSeats) =>
      prevSeats.map((prevSeat) =>
        prevSeat.id === seat.id ? updatedSeats[0] : prevSeat
      )
    );
    setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
  };

  const handleSeatsSelected = (bestSeats: Seat[]) => {
    // Clear any previously selected seats
    const clearedSeats = seats.map((seat) =>
      selectedSeats.some((selected) => selected.id === seat.id)
        ? { ...seat, status: 'available' }
        : seat
    );

    // Update selected seats
    const seatIds = bestSeats.map((seat) => seat.id);
    const updatedSeats = updateSeatStatus(clearedSeats, seatIds, 'selected');
    setSeats(updatedSeats);

    // Update selected seats state
    setSelectedSeats(
      bestSeats.map((seat) => ({ ...seat, status: 'selected' }))
    );

    // Show toast notification
    toast({
      title: 'Seats selected',
      description: `${bestSeats.length} seats have been selected for you. Please review and confirm.`,
    });
  };

  const handleBookingConfirm = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: 'No seats selected',
        description: 'Please select at least one seat to book.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in or sign up to confirm your booking.',
        variant: 'destructive',
      });
      return;
    }

    // Create a new booking
    const bookingId = uuidv4();
    const newBooking: Booking = {
      id: bookingId,
      userId: user.id,
      seats: selectedSeats,
      createdAt: new Date(),
    };

    // Update seats status to booked
    const seatIds = selectedSeats.map((seat) => seat.id);
    const updatedSeats = updateSeatStatus(
      seats,
      seatIds,
      'booked',
      user.id,
      bookingId
    );
    setSeats(updatedSeats);

    // Add the new booking to bookings
    setBookings((prev) => [...prev, newBooking]);

    // Reset selected seats
    setSelectedSeats([]);

    // Show success message
    toast({
      title: 'Booking confirmed!',
      description: `You have successfully booked ${selectedSeats.length} ${
        selectedSeats.length === 1 ? 'seat' : 'seats'
      }.`,
    });

    // Switch to my bookings tab
    setActiveTab('bookings');
  };

  const handleCancelBooking = (bookingId: string) => {
    // Find the booking
    const booking = bookings.find((b) => b.id === bookingId);
    
    if (!booking) return;

    // Get the seat IDs from the booking
    const seatIds = booking.seats.map((seat) => seat.id);

    // Update seats status to available
    const updatedSeats = updateSeatStatus(seats, seatIds, 'available');
    setSeats(updatedSeats);

    // Remove the booking
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));

    // Show success message
    toast({
      title: 'Booking cancelled',
      description: 'Your booking has been successfully cancelled.',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={handleLogout} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {!user ? (
          <div className="max-w-md mx-auto py-12">
            <AuthForm onAuthenticated={handleAuthenticated} />
          </div>
        ) : (
          <div className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
                <TabsTrigger value="book">Book Seats</TabsTrigger>
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              </TabsList>

              <TabsContent value="book" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <BookingForm seats={seats} onSeatsSelected={handleSeatsSelected} />
                  <SeatMap
                    seats={seats}
                    onSeatSelect={handleSeatSelect}
                    onSeatDeselect={handleSeatDeselect}
                    onBookingConfirm={handleBookingConfirm}
                    selectedSeats={selectedSeats}
                  />
                </div>
              </TabsContent>

              <TabsContent value="bookings">
                <UserBookings bookings={bookings} onCancelBooking={handleCancelBooking} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
