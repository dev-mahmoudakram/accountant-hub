import { Suspense } from 'react';
import Container from '@/components/layout/Container';
import ClientJobsContent from '@/components/client/ClientJobsContent';

export const metadata = {
  title: 'My Jobs — Accountant Hub',
};

export default function ClientJobsPage() {
  return (
    <Container>
      <Suspense>
        <ClientJobsContent />
      </Suspense>
    </Container>
  );
}
