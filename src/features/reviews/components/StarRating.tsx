"use client";
import { useState } from "react";
import { ItemStyles, Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const starStyles: ItemStyles = {
  itemShapes: Star,
  itemStrokeWidth: 2, // 테두리 두께 (0이면 테두리가 안 보여요)
  activeFillColor: "#facc15", // 선택된 별 안쪽 색
  activeStrokeColor: "#facc15", // 선택된 별 테두리 색
  inactiveFillColor: "#f3f4f6", // 선택 안 된 별 안쪽 색
  inactiveStrokeColor: "#d1d5db", // 선택 안 된 별 테두리 색
};
export function StarRating() {
  const [value, setValue] = useState(0);
  return (
    <Rating
      itemStyles={starStyles}
      spaceBetween={"small"}
      style={{ maxWidth: 240 }}
      value={value}
      onChange={setValue}
    />
  );
}
