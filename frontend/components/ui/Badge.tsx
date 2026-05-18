interface BadgeProps {
  variant?: 'open' | 'closed' | 'pending' | 'accepted' | 'rejected' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  open: 'bg-brand-light text-brand',
  closed: 'bg-gray-100 text-gray-500',
  pending: 'bg-yellow-50 text-yellow-700',
  accepted: 'bg-brand-light text-brand',
  rejected: 'bg-red-50 text-red-600',
  default: 'bg-gray-100 text-gray-600',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
