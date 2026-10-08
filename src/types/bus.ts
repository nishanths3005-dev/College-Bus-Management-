export interface BusStop {
  id: string;
  name: string;
  order: number;
  estimatedTimeMorning: string;
  estimatedTimeEvening: string;
}

export interface BusRoute {
  id: string;
  busNumber: string;
  routeName: string;
  shift: string;
  departureTime: string;
  driverName: string;
  driverPhone: string;
  totalSeats: number;
  availableSeats: number;
  stops: string[]; // List of stop names in order: e.g. ["College", "JP Nagar", "Jayanagar", "Banashankari"]
  stopDetails?: BusStop[];
  description?: string;
  // Representing seat occupancy for visual seat map (true = booked, false = available)
  seatOccupancy?: boolean[];
}

export type AvailabilityStatus = 'high' | 'medium' | 'low';

export function getAvailabilityStatus(available: number, total: number): AvailabilityStatus {
  const percentage = (available / total) * 100;
  if (percentage > 50) return 'high';
  if (percentage >= 20) return 'medium';
  return 'low';
}
