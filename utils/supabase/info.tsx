// utils/supabase/info.ts
export const projectId =
  import.meta.env.VITE_SUPABASE_URL ??
  "sb_publishable_XHNeoYb-Jm7fAa7qpMKlkQ_ov4UhG9Y"; // 또는 process.env.NEXT_PUBLIC_SUPABASE_URL
export const publicAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZ3B1Z2xndnd4bmZhYXdpcGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDgxNTEsImV4cCI6MjA3OTQ4NDE1MX0.x4WiDkKJPJe9MgJutj-M6ZortXT3kuH9gRC_UAx-UiM"; // 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY
