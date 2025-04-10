
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Booking } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface UserBookingsProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

const UserBookings: React.FC<UserBookingsProps> = ({ bookings, onCancelBooking }) => {
  const { toast } = useToast();

  const handleCancelBooking = (bookingId: string) => {
    // Show confirmation
    if (confirm('Are you sure you want to cancel this booking?')) {
      onCancelBooking(bookingId);
      toast({
        title: 'Booking cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
    }
  };

  // Format date helper function
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>You have no active bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Once you make a booking, you'll see it appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Bookings</CardTitle>
        <CardDescription>Manage your active seat reservations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id.slice(0, 8)}</TableCell>
                <TableCell>{formatDate(booking.createdAt)}</TableCell>
                <TableCell>
                  {booking.seats.map((seat) => `${seat.row}-${seat.seatNumber}`).join(', ')}
                  <span className="text-muted-foreground ml-2">
                    ({booking.seats.length} {booking.seats.length === 1 ? 'seat' : 'seats'})
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserBookings;
