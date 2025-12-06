import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase/client';

export interface SubscriptionStatus {
  isPaid: boolean;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled';
  loading: boolean;
}

/**
 * 사용자의 구독 상태를 확인하는 훅
 */
export function useSubscription(): SubscriptionStatus {
  const { appUser } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isPaid: false,
    plan: 'free',
    status: 'inactive',
    loading: true,
  });

  useEffect(() => {
    const checkSubscription = async () => {
      if (!appUser) {
        setSubscription({
          isPaid: false,
          plan: 'free',
          status: 'inactive',
          loading: false,
        });
        return;
      }

      try {
        // 사용자 정보에서 구독 상태 확인
        const { data, error } = await supabase
          .from('users')
          .select('subscription_status, subscription_plan')
          .eq('id', appUser.id)
          .single();

        if (error) {
          console.error('Error checking subscription:', error);
          setSubscription({
            isPaid: false,
            plan: 'free',
            status: 'inactive',
            loading: false,
          });
          return;
        }

        const isPaid = 
          data.subscription_status === 'active' && 
          data.subscription_plan !== 'free';

        setSubscription({
          isPaid,
          plan: (data.subscription_plan || 'free') as 'free' | 'basic' | 'pro' | 'enterprise',
          status: (data.subscription_status || 'inactive') as 'active' | 'inactive' | 'cancelled',
          loading: false,
        });
      } catch (error) {
        console.error('Error checking subscription:', error);
        setSubscription({
          isPaid: false,
          plan: 'free',
          status: 'inactive',
          loading: false,
        });
      }
    };

    checkSubscription();
  }, [appUser]);

  return subscription;
}

