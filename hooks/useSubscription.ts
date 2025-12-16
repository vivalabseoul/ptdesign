import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface SubscriptionStatus {
  isPaid: boolean;
  plan: 'guest' | 'basic' | 'pro' | 'enterprise';
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
    plan: 'guest',
    status: 'inactive',
    loading: true,
  });

  useEffect(() => {
    const checkSubscription = async () => {
      if (!appUser) {
        setSubscription({
          isPaid: false,
          plan: 'guest',
          status: 'inactive',
          loading: false,
        });
        return;
      }

      try {
        // TODO: 실제 구독 상태 확인 API 연동 필요
        // 현재는 사용자 프로필의 구독 정보 사용
        const isPaid = 
          appUser.subscription_status === 'active' && 
          appUser.subscription_plan !== 'guest';

        setSubscription({
          isPaid,
          plan: (appUser.subscription_plan || 'guest') as 'guest' | 'basic' | 'pro' | 'enterprise',
          status: (appUser.subscription_status || 'inactive') as 'active' | 'inactive' | 'cancelled',
          loading: false,
        });
      } catch (error) {
        console.error('Error checking subscription:', error);
        setSubscription({
          isPaid: false,
          plan: 'guest',
          status: 'inactive',
          loading: false,
        });
      }
    };

    checkSubscription();
  }, [appUser]);

  return subscription;
}
