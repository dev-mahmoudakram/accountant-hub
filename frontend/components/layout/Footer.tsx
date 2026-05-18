import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
          <p className="text-sm font-semibold text-brand">Accountant Hub</p>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Accountant Hub. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
