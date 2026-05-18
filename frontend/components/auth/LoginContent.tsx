'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';
import Alert from '@/components/ui/Alert';
import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { AuthResponse } from '@/types/user';
import { IMAGES } from '@/lib/images';
import { fadeUp, staggerContainer } from '@/lib/animations';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isReady } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const prevIsReadyRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

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
      const res = await api.post<ApiResponse<AuthResponse>>('/login', data);
      login(res.data.token, res.data.user);
      const redirect = searchParams.get('redirect') ?? '/jobs';
      router.push(redirect);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setServerError(error.message ?? 'Invalid email or password.');
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
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-ink/80 via-ink/60 to-brand/20" />

        {/* Content */}
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
              Your next accounting<br />opportunity awaits.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Connect with companies looking for skilled accounting professionals
              across tax, bookkeeping, auditing, and more.
            </p>

            <div className="flex gap-6 mt-8">
              {[
                { value: '500+', label: 'Jobs' },
                { value: '200+', label: 'Accountants' },
                { value: '95%', label: 'Success Rate' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/40 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-8 bg-white">
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
            <h1 className="text-2xl font-bold text-ink mb-1">Welcome back</h1>
            <p className="text-sm text-muted mb-8">
              Sign in to your account to continue
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white border border-border rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {serverError && <Alert variant="error">{serverError}</Alert>}

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <PasswordInput
                label="Password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full"
              >
                Sign In
              </Button>
            </form>
          </motion.div>

          <motion.p variants={fadeUp} className="text-center text-sm text-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand hover:underline font-semibold">
              Create one free
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
