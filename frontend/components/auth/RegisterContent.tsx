'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import PasswordStrength from '@/components/ui/PasswordStrength';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { AuthResponse } from '@/types/user';
import { IMAGES } from '@/lib/images';
import { fadeUp, staggerContainer } from '@/lib/animations';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(120),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterContent() {
  const router = useRouter();
  const { login, isAuthenticated, isReady } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const prevIsReadyRef = useRef(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' });

  useEffect(() => {
    if (!prevIsReadyRef.current && isReady && isAuthenticated) {
      router.replace('/jobs');
    }
    prevIsReadyRef.current = isReady;
  }, [isReady, isAuthenticated, router]);

  if (!isReady || isAuthenticated) return null;

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      const res = await api.post<ApiResponse<AuthResponse>>('/register', data);
      login(res.data.token, res.data.user);
      router.push('/jobs');
    } catch (err: unknown) {
      const error = err as {
        status?: number;
        message?: string;
        errors?: Record<string, string[]>;
      };
      if (error.status === 422 && error.errors) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, { message: messages[0] });
        });
      } else {
        setServerError(error.message ?? 'Something went wrong. Please try again.');
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel – image + branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-ink overflow-hidden">
        <Image
          src={IMAGES.authSide}
          alt="Professional accounting workspace"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-br from-ink/80 via-ink/60 to-brand/20" />

        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-base">
              Accountant<span className="text-brand">Hub</span>
            </span>
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              Join hundreds of<br />accounting professionals.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Create a free account, browse available jobs, and start submitting
              competitive bids today.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                'Free to join — no subscription needed',
                'Browse and bid on accounting jobs',
                'Manage all your bids in one dashboard',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="w-5 h-5 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-8 bg-white overflow-y-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp} className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-bold text-base text-ink">Accountant<span className="text-brand">Hub</span></span>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h1 className="text-2xl font-bold text-ink mb-1">Create your account</h1>
            <p className="text-sm text-muted mb-8">
              Join and start bidding on accounting jobs
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white border border-border rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {serverError && <Alert variant="error">{serverError}</Alert>}

              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <div>
                <PasswordInput
                  label="Password"
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <PasswordStrength password={passwordValue} />
              </div>

              <PasswordInput
                label="Confirm Password"
                placeholder="Repeat your password"
                autoComplete="new-password"
                error={errors.password_confirmation?.message}
                {...register('password_confirmation')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full"
              >
                Create Account
              </Button>
            </form>
          </motion.div>

          <motion.p variants={fadeUp} className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand hover:underline font-semibold">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
