interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variants = {
  success: 'bg-brand-light border-brand text-brand',
  error: 'bg-red-50 border-red-300 text-red-700',
  warning: 'bg-yellow-50 border-yellow-300 text-yellow-700',
  info: 'bg-blue-50 border-blue-300 text-blue-700',
};

export default function Alert({ variant = 'info', title, children, className = '' }: AlertProps) {
  return (
    <div className={`rounded-lg border p-4 ${variants[variant]} ${className}`} role="alert">
      {title && <p className="font-medium mb-1">{title}</p>}
      <div className="text-sm">{children}</div>
    </div>
  );
}
