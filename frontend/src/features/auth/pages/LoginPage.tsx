import { useState } from 'react';
import DarkVeil from '@/components/DarkVeil';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Briefcase, Gamepad2, Globe, LayoutDashboard, Lock, Loader2, Mail, MonitorPlay, ShieldCheck, Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useAccountStore } from '@/stores/account.store';
import { defaultAccountId, mockAccounts } from '@/lib/mock/mockAccounts';
import { buildLoginUser, getRoleLandingPath } from '@/lib/auth/access-control';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);
  const setAccounts = useAccountStore((state) => state.setAccounts);
  const setActiveAccount = useAccountStore((state) => state.setActiveAccount);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });


  async function onSubmit(values: LoginValues) {
    if (values.password !== '1234567890') {
      toast({
        title: 'Login Failed',
        description: 'Incorrect login details.',
        variant: 'error',
      });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = buildLoginUser(values.email);

    if (!user) {
      toast({
        title: 'Login Failed',
        description: 'Incorrect login details.',
        variant: 'error',
      });
      return;
    }

    login(user, 'mock-token-dev');
    setAccounts(mockAccounts);
    setActiveAccount(defaultAccountId);

    navigate(getRoleLandingPath(user.role), { replace: true });
  }

  return (
    <div className="flex w-full justify-center min-h-[600px]">
      <div className="z-10 w-full max-w-6xl animate-fade-up">
        <div className="grid overflow-hidden rounded-[2.5rem] shadow-2xl glass-card lg:grid-cols-2">

          {/* ── LEFT PANEL ── */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-black/40 backdrop-blur-sm p-10 text-white lg:p-14">

            {/* Animation — scoped to left panel */}
            <div className="absolute inset-0 z-0">
              <DarkVeil />
            </div>

            {/* Logo */}
            <a
              href="https://speedlinkng.com/high-speed-fibre-internet/"
              target="_blank"
              rel="noreferrer noopener"
              className="relative z-10 flex items-center gap-3 transition-opacity hover:opacity-90"
              aria-label="Visit Speedlink Training"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-transparent">
                {!logoLoadFailed ? (
                  <img
                    src="/speedlink-logo.png"
                    alt="Speedlink logo"
                    onError={() => setLogoLoadFailed(true)}
                    className="h-full w-full object-contain p-0"
                    loading="lazy"
                  />
                ) : (
                  <Zap className="h-12 w-12 text-accent-light" />
                )}
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight">
                Speedlink Connect
              </span>
            </a>

            {/* Headline */}
            <div className="relative z-10 mt-16 mb-8 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                <ShieldCheck className="h-4 w-4" />
                Secure Portal
              </div>
              <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                One platform
              </h1>

              {/* Use-case badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-2">
                  <MonitorPlay className="h-4 w-4" />
                  Stream
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />

                <span className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Work
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />

                <span className="inline-flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" />
                  Game
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />

                <span className="inline-flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Connect
                </span>
              </div>

              <p className="max-w-md text-lg leading-relaxed text-white/80">
                Experience the future of connectivity with our reliable, high‑speed Fibre-to-the-Home (FTTH) internet
              </p>
            </div>

            {/* Footer badges */}
            <div className="relative z-10 mt-auto">
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" /> Encrypted
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <LayoutDashboard className="h-4 w-4" /> Real-time
                </span>
              </div>
            </div>

          </div>
          {/* ── END LEFT PANEL ── */}

          {/* ── RIGHT PANEL ── */}
          <div className="flex flex-col justify-center bg-white/90 backdrop-blur-xl p-10 lg:p-16 dark:bg-slate-900/90">
            <div className="mx-auto w-full max-w-md space-y-8">

              <div className="text-center">
                <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
                  Welcome Back
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Log in to your account to continue.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="e.g. name@company.com"
                        className={`w-full rounded-2xl border ${
                          errors.email
                            ? 'border-danger focus:ring-danger/10'
                            : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                        } bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-primary dark:focus:bg-slate-900`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-danger text-xs font-medium">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <input
                        id="password"
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        className={`w-full rounded-2xl border ${
                          errors.password
                            ? 'border-danger focus:ring-danger/10'
                            : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                        } bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-primary dark:focus:bg-slate-900`}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-danger text-xs font-medium">{errors.password.message}</p>
                    )}
                  </div>

                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary-light hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isSubmitting ? 'Verifying...' : 'Access Portal'}
                  </span>
                  {isSubmitting ? (
                    <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </button>

              </form>
            </div>
          </div>
          {/* ── END RIGHT PANEL ── */}

        </div>
      </div>
    </div>
  );
}
