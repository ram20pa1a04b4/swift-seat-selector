
import { Seat, SeatStatus } from "../types";

/**
 * Generate a complete seat map for the train coach
 * - 11 rows with 7 seats each
 * - 1 last row with 3 seats
 */
export const generateSeatMap = (): Seat[] => {
  const seats: Seat[] = [];
  let seatId = 1;
  
  // Generate 11 rows with 7 seats each
  for (let row = 1; row <= 11; row++) {
    for (let seatNumber = 1; seatNumber <= 7; seatNumber++) {
      seats.push({
        id: seatId,
        row,
        seatNumber,
        status: 'available'
      });
      seatId++;
    }
  }
  
  // Generate last row with 3 seats
  for (let seatNumber = 1; seatNumber <= 3; seatNumber++) {
    seats.push({
      id: seatId,
      row: 12,
      seatNumber,
      status: 'available'
    });
    seatId++;
  }
  
  return seats;
};

/**
 * Organize seats by row for better UI rendering
 */
export const organizeSeatsByRow = (seats: Seat[]): Seat[][] => {
  const rows: Seat[][] = [];
  
  // First 11 rows with 7 seats each
  for (let row = 1; row <= 11; row++) {
    const rowSeats = seats.filter(seat => seat.row === row);
    rows.push(rowSeats);
  }
  
  // Last row with 3 seats
  const lastRow = seats.filter(seat => seat.row === 12);
  rows.push(lastRow);
  
  return rows;
};

/**
 * Find the best available seats for a given booking
 * Priority:
 * 1. Same row if possible
 * 2. Adjacent or nearby seats across rows
 */
export const findBestAvailableSeats = (
  seats: Seat[],
  numSeats: number
): Seat[] => {
  if (numSeats <= 0 || numSeats > 7) {
    return [];
  }

  const availableSeats = seats.filter(seat => seat.status === 'available');
  
  // If not enough available seats, return empty array
  if (availableSeats.length < numSeats) {
    return [];
  }

  // Try to find seats in the same row
  for (let row = 1; row <= 12; row++) {
    const rowSeats = availableSeats.filter(seat => seat.row === row);
    if (rowSeats.length >= numSeats) {
      return rowSeats.slice(0, numSeats);
    }
  }

  // If no complete row available, find best adjacent seats
  // Sort by row and seat number to get physically closer seats
  const sortedSeats = [...availableSeats].sort((a, b) => {
    if (a.row === b.row) {
      return a.seatNumber - b.seatNumber;
    }
    return a.row - b.row;
  });

  return sortedSeats.slice(0, numSeats);
};

/**
 * Update seat status
 */
export const updateSeatStatus = (
  seats: Seat[],
  seatIds: number[],
  status: SeatStatus,
  userId?: string,
  bookingId?: string
): Seat[] => {
  return seats.map(seat => {
    if (seatIds.includes(seat.id)) {
      return {
        ...seat,
        status,
        userId,
        bookingId
      };
    }
    return seat;
  });
};

/**
 * Check if a seat is available
 */
export const isSeatAvailable = (seat: Seat): boolean => {
  return seat.status === 'available';
};

/**
 * Count available seats
 */
export const countAvailableSeats = (seats: Seat[]): number => {
  return seats.filter(seat => seat.status === 'available').length;
};
