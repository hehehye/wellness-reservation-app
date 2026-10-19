"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut(); // ① 세션 끊고 쿠키 지우기
  revalidatePath("/", "layout");
}
