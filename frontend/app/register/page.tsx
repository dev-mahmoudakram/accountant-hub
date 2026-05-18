import { Suspense } from 'react';
import RegisterContent from '@/components/auth/RegisterContent';

export const metadata = {
  title: 'Create Account — Accountant Hub',
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}
