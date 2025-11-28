import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://kjgpuglgvwxnfaawipje.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "";

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === "true";

export const SUPABASE_URL = envSupabaseUrl || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = envSupabaseAnonKey || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, supabaseAnonKey);

// Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: "customer" | "expert" | "admin";
          subscription_tier: "free" | "basic" | "professional" | "enterprise";
          free_analysis_used: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: "customer" | "expert" | "admin";
          subscription_tier?: "free" | "basic" | "professional" | "enterprise";
          free_analysis_used?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: "customer" | "expert" | "admin";
          subscription_tier?: "free" | "basic" | "professional" | "enterprise";
          free_analysis_used?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          status: "pending" | "analyzing" | "completed" | "reviewed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          status?: "pending" | "analyzing" | "completed" | "reviewed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          status?: "pending" | "analyzing" | "completed" | "reviewed";
          created_at?: string;
          updated_at?: string;
        };
      };
      analysis_reports: {
        Row: {
          id: string;
          project_id: string;
          report_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          report_data: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          report_data?: Json;
          created_at?: string;
        };
      };
      expert_reviews: {
        Row: {
          id: string;
          project_id: string;
          expert_id: string;
          review_data: Json;
          status: "draft" | "submitted";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          expert_id: string;
          review_data: Json;
          status?: "draft" | "submitted";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          expert_id?: string;
          review_data?: Json;
          status?: "draft" | "submitted";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
