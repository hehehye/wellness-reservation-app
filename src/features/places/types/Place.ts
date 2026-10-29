export interface Review_count {
  place_reviews: string;
}
// 장소 , 스튜디오 개념
export interface Place {
  id: string;
  owner_id: string | null;
  name: string;
  category: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  amenities: string[];
  created_at: string;
  isLiked: boolean;
  imageUrl: string;
  _count: Review_count;
}

export interface Place_images {
  id: string;
  place_id: string;
  storage_path: string;
  sort_order: string; // 보여주는 이미지 순서
  created_at: string;
}
// 수업의 틀. 여러개의 시간대로 만들어낼수있음
export interface Class {
  id: string;
  place_id: string; // 어느 스튜디오의 수업인지
  title: string; // ex: 바벨 6:1수업
  description: string | null;
  price: number;
  capacity: number; // 기본 정원 (회차 만들 때 복사됨)
  duration_min: number;
  guide: string | null;
  is_active: boolean;
  created_at: string;
}
// 수업. Class를이용한 여러 시간대의 수업을 제작.
// 각 수업은 시작시간, 종료시간과 예약오픈시간, 마감시간을 필수로 한다.
export interface Class_session {
  id: string; // book에서 참조.
  class_id: string; // 참조과목의 id.
  start_at: Date; // 수업시작시간
  end_at: Date; // 수업종료시간
  capacity: number;
  booking_opens_at: Date; // 예약 오픈 시각
  booking_closes_at: Date; // 예약 마감 시각
  created_at: Date;
}
export interface Place_likes {
  user_id: string;
  place_id: string;
  created_at: string;
}
