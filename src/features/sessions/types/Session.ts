export type ClassInfo = {
  title: string;
  price: number;
  duration_min: number;
  place_id: string;
  places: {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
};
export type SessionItem = {
  id: string;
  class_id: string;
  start_at: string;
  end_at: string;
  capacity: number;
  remaining: number;
  taken: number;
  booking_opens_at: string;
  created_at: string;
  classes: ClassInfo;
};

// 상세 API(/sessions/:id)는 classes 안에 장소 정보까지 함께 내려준다
export type SessionDetail = SessionItem & {
  classes: SessionItem["classes"] & {
    place_id: string;
    places: {
      id: string;
      name: string;
      address: string;
    };
  };
};
