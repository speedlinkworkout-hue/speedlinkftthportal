import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LayoutDashboard, CreditCard, Headphones, UserCog, CircleAlert, Mail, ShieldCheck, Zap, Lock } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useAccountStore } from '@/stores/account.store';
import { defaultAccountId, mockAccounts } from '@/lib/mock/mockAccounts';
import { accessProfiles, buildLoginUser, getAccessProfileByEmail, getRoleLandingPath } from '@/lib/auth/access-control';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);
  const setAccounts = useAccountStore((state) => state.setAccounts);
  const setActiveAccount = useAccountStore((state) => state.setActiveAccount);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const profile = useMemo(() => getAccessProfileByEmail(email), [email]);

  function handleLogin() {
    if (!email || !password) {
      toast({
        title: 'Credentials Required',
        description: 'Please enter both an email address and a password.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== '1234567890') {
      toast({
        title: 'Invalid Password',
        description: 'The password you entered is incorrect.',
        variant: 'destructive',
      });
      return;
    }

    const user = buildLoginUser(email);

    if (!user) {
      toast({
        title: 'Unknown email',
        description: 'You do not have an active account associated with this email.',
        variant: 'destructive',
      });
      return;
    }

    login(user, 'mock-token-dev');
    setAccounts(mockAccounts);
    setActiveAccount(defaultAccountId);

    toast({
      title: 'Access granted',
      description: `Welcome back, ${user.firstName}.`,
    });

    navigate(getRoleLandingPath(user.role), { replace: true });
  }

  return (
    <div className="relative flex w-full justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] animate-pulse rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] animate-pulse animate-delay-2000 rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-6xl animate-fade-up">
        <div className="grid overflow-hidden rounded-[2.5rem] shadow-2xl glass-card lg:grid-cols-2">

          {/* Left Panel: Branding & Context */}
          <div className="relative flex flex-col justify-between bg-gradient-to-br from-primary/95 to-primary-light/95 p-10 text-white lg:p-14">
              <a
                href="https://speedlinktraining.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="relative z-10 flex items-center gap-3 transition-opacity hover:opacity-90"
                aria-label="Visit Speedlink Training"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-transparent">
                  {!logoLoadFailed ? (
                    <img
                      src={`/${encodeURIComponent('Speedlink logo.png')}`}
                      alt="Speedlink logo"
                      onError={() => setLogoLoadFailed(true)}
                      className="h-full w-full object-contain p-0"
                    />
                  ) : (
                    <Zap className="h-12 w-12 text-accent-light" />
                  )}
                </div>
                <span className="font-heading text-2xl font-bold tracking-tight">Speedlink Interconnect</span>
              </a>

            <div className="relative z-10 mt-16 mb-8 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                <ShieldCheck className="h-4 w-4" />
                Secure Portal
              </div>
              <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                One platform.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-teal-200">Endless connection.</span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-white/80">
                Experience seamless internet management. Enter your email and password to access your personalized portal.
              </p>
            </div>

            <div className="relative z-10 mt-auto">
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Encrypted</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5"><LayoutDashboard className="h-4 w-4" /> Real-time</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Login Form */}
          <div className="flex flex-col justify-center bg-white p-10 lg:p-16 dark:bg-slate-900">
            <div className="mx-auto w-full max-w-md space-y-8">
              <div className="text-center">
                <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Log in to your account to continue.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@company.com"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-primary dark:focus:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-primary dark:focus:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Preview Card */}
                <div className={`overflow-hidden rounded-2xl transition-all duration-500 ${profile ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {profile && (
                    <div className="border border-accent/20 bg-accent/5 p-4 dark:bg-accent/10">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 text-accent" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.title} access detected</p>
                          
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {email && !profile && (
                  <div className="animate-fade-up rounded-2xl border border-danger/20 bg-danger/5 p-4 dark:bg-danger/10">
                    <div className="flex items-start gap-3">
                      <CircleAlert className="mt-0.5 h-5 w-5 text-danger" />
                      <div>
                        <p className="text-sm font-semibold text-danger">Unrecognized Email</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Ensure you have an active account associated with this email.</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary-light hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Access Portal</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
