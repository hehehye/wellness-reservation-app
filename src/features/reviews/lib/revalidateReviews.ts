"use server";
import { revalidateTag } from "next/cache";

export async function revalidateReviews() {
  revalidateTag("reviews", "max");
}
