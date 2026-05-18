interface PasswordStrengthProps {
  password: string;
}

interface Level {
  label: string;
  color: string;
  textColor: string;
}

const LEVELS: Level[] = [
  { label: 'Weak',   color: 'bg-red-500',    textColor: 'text-red-500' },
  { label: 'Fair',   color: 'bg-orange-400', textColor: 'text-orange-400' },
  { label: 'Good',   color: 'bg-blue-500',   textColor: 'text-blue-500' },
  { label: 'Strong', color: 'bg-brand',      textColor: 'text-brand' },
];

function getScore(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)           score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password))  score++;
  return score; // 0–4
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const score = getScore(password);
  const level = LEVELS[Math.max(0, score - 1)];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {LEVELS.map((l, i) => (
          <div
            key={l.label}
            className={[
              'h-1 flex-1 rounded-full transition-all duration-300',
              i < score ? l.color : 'bg-gray-200',
            ].join(' ')}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${level.textColor}`}>{level.label}</p>
    </div>
  );
}
