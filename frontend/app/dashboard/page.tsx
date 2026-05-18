import { Suspense } from 'react';
import Container from '@/components/layout/Container';
import MyBidsContent from '@/components/bids/MyBidsContent';

export const metadata = {
  title: 'My Bids — Accountant Hub',
};

export default function DashboardPage() {
  return (
    <Container>
      <Suspense>
        <MyBidsContent />
      </Suspense>
    </Container>
  );
}
