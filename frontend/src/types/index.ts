export type UserRole =
  | 'ORGANIZER'
  | 'CUSTOMER'
  | 'GATEKEEPER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  overview?: string;
  posterPath?: string;
  releaseDate?: string;
}

export interface Seat {
  id: string;
  eventId: string;
  row: string;
  number: number;
  status: 'AVAILABLE' | 'BLOCKED';
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  venue: string;
  room: string;
  price: string;
  capacity: number;
  status: string;
  movie: Movie;
  seats: Seat[];
}

export interface Ticket {
  id: string;
  code: string;
  qrToken: string;
  status: string;
}