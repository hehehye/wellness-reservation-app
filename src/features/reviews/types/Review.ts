export interface ReviewUser {
  id: string;
  name: string;
}
export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  booking_id: string;
  content: string;
  rating: number;
  created_at: string;
  users: ReviewUser;
}
