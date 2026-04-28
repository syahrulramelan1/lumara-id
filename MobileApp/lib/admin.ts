import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SECRET = process.env.ADMIN_SECRET ?? "";

export function checkAdminSecret(req: NextRequest): boolean {
  return req.headers.get("x-admin-secret") === SECRET && SECRET !== "";
}

export function adminUnauthorized() {
  return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function uploadImage(file: File, bucket = "lumara-id"): Promise<string> {
  const supabase = getSupabaseAdmin();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Upload gagal: ${error.message}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
