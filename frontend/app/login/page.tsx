import { Suspense } from 'react';
import LoginContent from '@/components/auth/LoginContent';

export const metadata = {
  title: 'Sign In — Accountant Hub',
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
