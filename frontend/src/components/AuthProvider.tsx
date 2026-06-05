'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, fetchMe, isLoading } = useAuthStore();

  useEffect(() => {
    const hasToken = typeof window !== 'undefined' && window.localStorage.getItem('rops_access_token');
    if (hasToken && !user) {
      fetchMe().catch(() => undefined);
    }
  }, [user, fetchMe]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
