
// User-related types
export interface User {
  id: string;
  username: string;
  email: string;
}

// Authentication-related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Seat-related types
export type SeatStatus = 'available' | 'booked' | 'selected';

export interface Seat {
  id: number;
  row: number;
  seatNumber: number;
  status: SeatStatus;
  userId?: string;
  bookingId?: string;
}

// Booking-related types
export interface Booking {
  id: string;
  userId: string;
  seats: Seat[];
  createdAt: Date;
}
