"use client";
import { Button } from "@/features/shared/ui/Button";
import { Share } from "lucide-react";

interface Props {
  placeId: string;
}
export default function ShareButton({ placeId }: Props) {
  return (
    <Button onClick={() => {}} variant={"ghost"}>
      <Share />
    </Button>
  );
}
