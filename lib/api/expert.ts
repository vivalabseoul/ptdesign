import { supabase } from '../supabase';

export interface ExpertApplication {
  name: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  specialization?: string;
  portfolioUrl?: string;
  introduction: string;
}

/**
 * 전문가 신청 제출
 */
export async function submitExpertApplication(data: ExpertApplication) {
  const { data: result, error } = await supabase
    .from('expert_applications')
    .insert([{
      name: data.name,
      email: data.email,
      phone: data.phone,
      years_of_experience: data.yearsOfExperience,
      specialization: data.specialization,
      portfolio_url: data.portfolioUrl,
      introduction: data.introduction,
      status: 'pending',
    }])
    .select();
  
  if (error) throw error;
  return result;
}

/**
 * 전문가 신청 목록 조회 (관리자용)
 */
export async function getExpertApplications(status?: 'pending' | 'approved' | 'rejected') {
  let query = supabase
    .from('expert_applications')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

/**
 * 전문가 신청 상태 업데이트 (관리자용)
 */
export async function updateExpertApplicationStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  const { data, error } = await supabase
    .from('expert_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
}
