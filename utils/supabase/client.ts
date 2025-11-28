import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// 사용자 역할 타입
export type UserRole = 'admin' | 'user';

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  phone?: string;
  subscription_status?: 'active' | 'inactive' | 'cancelled';
  subscription_plan?: 'free' | 'basic' | 'pro' | 'enterprise';
}

// 분석 기록 타입
export interface AnalysisRecord {
  id: string;
  user_id: string;
  url: string;
  site_name: string;
  site_address?: string;
  analysis_date: string;
  author_name: string;
  author_contact: string;
  issues: Array<{
    category: string;
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    recommendation: string;
    visualExample?: {
      type: 'color' | 'spacing' | 'size';
      before?: string;
      after?: string;
    };
    improvedDesignUrl?: string;
  }>;
  score: {
    overall: number;
    usability: number;
    accessibility: number;
    visual: number;
    performance: number;
  };
  screenshot_url?: string;
  improved_design_urls?: Array<{
    issueId: string;
    issueTitle: string;
    imageUrl: string;
    description: string;
  }>;
  created_at: string;
}

