"use client";

import { useState } from "react";
import { Place } from "../types/Place";
import PlaceList from "./PlaceList";
const limit = 8;
export default function PlaceListContent({ places }: { places: Place[] }) {
  const [count, setCount] = useState(limit);
  return <PlaceList places={places} />;
}
