interface BadgeProps {
  variant?: 'open' | 'closed' | 'pending' | 'accepted' | 'rejected' | 'default';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variants = {
  open: 'bg-brand-light text-brand border border-brand/20',
  closed: 'bg-gray-100 text-gray-500 border border-gray-200',
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  accepted: 'bg-brand-light text-brand border border-brand/20',
  rejected: 'bg-red-50 text-red-600 border border-red-200',
  default: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const dotColors = {
  open: 'bg-brand',
  closed: 'bg-gray-400',
  pending: 'bg-yellow-500',
  accepted: 'bg-brand',
  rejected: 'bg-red-500',
  default: 'bg-gray-400',
};

export default function Badge({
  variant = 'default',
  children,
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
