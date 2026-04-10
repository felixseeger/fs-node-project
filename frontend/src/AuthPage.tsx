import React, { useState, useEffect, FC, ChangeEvent, FormEvent, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './config/firebase';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Animated field ────────────────────────────────────────── */
interface AuthFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

const AuthField: FC<AuthFieldProps> = ({ label, type = 'text', placeholder, value, onChange, autoFocus }) => {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#888', letterSpacing: '0.03em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPw && !showPw ? 'password' : 'text'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${focused ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12,
            padding: '12px 16px',
            paddingRight: isPw ? 44 : 16,
            fontSize: 14,
            color: '#e0e0e0',
            outline: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
            transition: prefersReducedMotion ? 'none' : 'border-color 0.3s ease-out, background 0.3s ease-out',
            backgroundColor: focused ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
            boxSizing: 'border-box',
          }}
        />
        {isPw && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, color: '#666',
              transition: prefersReducedMotion ? 'none' : 'color 0.2s ease-out',
              padding: 4,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#aaa'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#666'; }}
          >
            {showPw ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Primary button ────────────────────────────────────────── */
interface AuthButtonProps {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
}

const AuthButton: FC<AuthButtonProps> = ({ label, onClick, loading, variant = 'primary', type = 'button' }) => {
  const [hovered, setHovered] = useState(false);
  const isPrimary = variant === 'primary';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '13px 20px',
        fontSize: 14,
        fontWeight: 700,
        border: isPrimary ? 'none' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        cursor: loading ? 'wait' : 'pointer',
        background: isPrimary
          ? hovered && !loading ? '#2563eb' : '#3b82f6'
          : hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        color: isPrimary ? '#fff' : '#ccc',
        transition: prefersReducedMotion ? 'none' : 'all 0.25s ease-out',
        boxShadow: isPrimary ? '0 4px 20px rgba(59,130,246,0.3)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: loading ? 0.8 : 1,
      }}
    >
      {loading && (
        <span style={{
          width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
          borderTop: '2px solid #fff', borderRadius: '50%',
          animation: 'authSpin 0.8s linear infinite',
          display: 'inline-block',
        }} />
      )}
      {label}
    </button>
  );
};

/* ── Social button ─────────────────────────────────────────── */
interface SocialButtonProps {
  label: string;
  icon: string | ReactNode;
  onClick: () => void;
  loading?: boolean;
}

const SocialButton: FC<SocialButtonProps> = ({ label, icon, onClick, loading }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: '11px 16px',
        fontSize: 13,
        fontWeight: 600,
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        color: '#ccc',
        cursor: loading ? 'wait' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: prefersReducedMotion ? 'none' : 'all 0.25s ease-out',
        opacity: loading ? 0.7 : 1,
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
};

/* ── Divider ───────────────────────────────────────────────── */
const Divider: FC<{ text: string }> = ({ text }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      <span style={{ fontSize: 11, color: '#555', fontWeight: 500, whiteSpace: 'nowrap' }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
};

/* ── Link button ───────────────────────────────────────────── */
const TextLink: FC<{ children: ReactNode; onClick: () => void }> = ({ children, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none', border: 'none', padding: 0,
        fontSize: 13, fontWeight: 600,
        color: hovered ? '#60a5fa' : '#3b82f6',
        cursor: 'pointer',
        transition: prefersReducedMotion ? 'none' : 'color 0.2s ease-out',
      }}
    >
      {children}
    </button>
  );
};

/* ── Checkbox ──────────────────────────────────────────────── */
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <label
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        cursor: 'pointer', fontSize: 13, color: '#888', lineHeight: 1.4,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.preventDefault(); onChange(!checked); }}
    >
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        style={{
          width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
          background: checked ? '#3b82f6' : hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${checked ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: prefersReducedMotion ? 'none' : 'all 0.2s ease-out',
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span>{label}</span>
      <input type="checkbox" checked={checked} readOnly style={{ display: 'none' }} />
    </label>
  );
};

/* ── Auth card shell ───────────────────────────────────────── */
const AuthCard: FC<{ children: ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      width: 420, maxWidth: '92vw',
      background: 'rgba(18,18,18,0.75)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 20,
      padding: '40px 36px 36px',
      position: 'relative',
      overflow: 'hidden',
      willChange: 'transform, opacity',
      transition: prefersReducedMotion
        ? 'none'
        : 'transform 0.6s cubic-bezier(.22,1,.36,1), opacity 0.6s cubic-bezier(.22,1,.36,1)',
      transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
      opacity: mounted ? 1 : 0,
      boxShadow: '0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
    }}>
      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
};

/* ── Logo mark ─────────────────────────────────────────────── */
const LogoMark: FC<{ onClick?: (page: string) => void }> = ({ onClick }) => {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', marginBottom: 32,
    }}>
      <button 
        onClick={() => onClick?.('landing')}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: 'opacity 0.2s' }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
      >
        <img
          src="/logo-light.svg"
          alt="Logo"
          style={{ height: 32, width: 'auto', opacity: 0.9 }}
        />
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   LOGIN SCREEN
   ═══════════════════════════════════════════════════════════════ */
interface ScreenProps {
  onNavigate: (screen: string) => void;
  onSocialLogin: (provider: string) => Promise<void>;
  onExternalNavigate: (page: string) => void;
}

const LoginScreen: FC<ScreenProps> = ({ onNavigate, onSocialLogin, onExternalNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('[Auth] Login error:', err);
      setError(err.message.replace('Firebase: ', ''));
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <LogoMark onClick={onExternalNavigate} />

      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f0f0', textAlign: 'center', margin: '0 0 4px' }}>
        Welcome back
      </h2>
      <p style={{ fontSize: 14, color: '#777', textAlign: 'center', margin: '0 0 28px' }}>
        Sign in to your account to continue
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <AuthField
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div style={{
            padding: '10px 14px', fontSize: 13, color: '#f87171',
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: 10,
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => onNavigate('forgot')}
            style={{
              background: 'none', border: 'none', padding: 0,
              fontSize: 12, color: '#888', cursor: 'pointer',
              transition: prefersReducedMotion ? 'none' : 'color 0.2s ease-out',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#3b82f6'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#888'; }}
          >
            Forgot password?
          </button>
        </div>

        <AuthButton label="Sign In" loading={loading} type="submit" />
      </form>

      <Divider text="or continue with" />

      <div style={{ display: 'flex', gap: 10 }}>
        <SocialButton label="Google" icon="G" loading={loading} onClick={() => onSocialLogin('google')} />
        <SocialButton label="GitHub" icon="&#9741;" loading={loading} onClick={() => onSocialLogin('github')} />
      </div>

      <p style={{ fontSize: 13, color: '#777', textAlign: 'center', margin: '24px 0 0' }}>
        Don't have an account?{' '}
        <TextLink onClick={() => onNavigate('signup')}>Sign up</TextLink>
      </p>
    </AuthCard>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SIGNUP SCREEN
   ═══════════════════════════════════════════════════════════════ */
const SignupScreen: FC<ScreenProps> = ({ onNavigate, onSocialLogin, onExternalNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service.');
      return;
    }
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update display name
      await updateProfile(userCredential.user, { displayName: name });
    } catch (err: any) {
      console.error('[Auth] Signup error:', err);
      setError(err.message.replace('Firebase: ', ''));
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <LogoMark onClick={onExternalNavigate} />

      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f0f0', textAlign: 'center', margin: '0 0 4px' }}>
        Create your account
      </h2>
      <p style={{ fontSize: 14, color: '#777', textAlign: 'center', margin: '0 0 28px' }}>
        Start building AI workflows in minutes
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthField
          label="Full Name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <AuthField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthField
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && (
          <div style={{
            padding: '10px 14px', fontSize: 13, color: '#f87171',
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: 10,
          }}>
            {error}
          </div>
        )}

        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={agreed}
          onChange={setAgreed}
        />

        <AuthButton label="Create Account" loading={loading} type="submit" />
      </form>

      <Divider text="or sign up with" />

      <div style={{ display: 'flex', gap: 10 }}>
        <SocialButton label="Google" icon="G" loading={loading} onClick={() => onSocialLogin('google')} />
        <SocialButton label="GitHub" icon="&#9741;" loading={loading} onClick={() => onSocialLogin('github')} />
      </div>

      <p style={{ fontSize: 13, color: '#777', textAlign: 'center', margin: '24px 0 0' }}>
        Already have an account?{' '}
        <TextLink onClick={() => onNavigate('login')}>Sign in</TextLink>
      </p>
    </AuthCard>
  );
};

/* ── Forgot screen ─────────────────────────────────────────── */
interface ForgotScreenProps {
  onNavigate: (screen: string) => void;
  onExternalNavigate: (page: string) => void;
}

const ForgotScreen: FC<ForgotScreenProps> = ({ onNavigate, onExternalNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      console.error('[Auth] Reset error:', err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard>
        <LogoMark onClick={onExternalNavigate} />

        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 20,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
          }}>
            ✓
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f0f0', textAlign: 'center', margin: '0 0 4px' }}>
          Check your email
        </h2>
        <p style={{ fontSize: 14, color: '#777', textAlign: 'center', margin: '0 0 28px', lineHeight: 1.5 }}>
          We've sent a password reset link to<br />
          <span style={{ color: '#e0e0e0', fontWeight: 600 }}>{email}</span>
        </p>

        <AuthButton label="Back to Sign In" variant="ghost" onClick={() => onNavigate('login')} />

        <p style={{ fontSize: 12, color: '#555', textAlign: 'center', margin: '20px 0 0' }}>
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={() => setSent(false)}
            style={{
              background: 'none', border: 'none', padding: 0,
              fontSize: 12, color: '#3b82f6', cursor: 'pointer', fontWeight: 600,
            }}
          >
            try again
          </button>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <LogoMark onClick={onExternalNavigate} />

      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f0f0f0', textAlign: 'center', margin: '0 0 4px' }}>
        Reset your password
      </h2>
      <p style={{ fontSize: 14, color: '#777', textAlign: 'center', margin: '0 0 28px', lineHeight: 1.5 }}>
        Enter your email and we'll send you a reset link
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />

        {error && (
          <div style={{
            padding: '10px 14px', fontSize: 13, color: '#f87171',
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            borderRadius: 10,
          }}>
            {error}
          </div>
        )}

        <AuthButton label="Send Reset Link" loading={loading} type="submit" />
      </form>

      <p style={{ fontSize: 13, color: '#777', textAlign: 'center', margin: '24px 0 0' }}>
        <TextLink onClick={() => onNavigate('login')}>← Back to Sign In</TextLink>
      </p>
    </AuthCard>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN AUTH PAGE — routes between screens
   ═══════════════════════════════════════════════════════════════ */
interface AuthPageProps {
  initialScreen?: string;
  onNavigate: (page: string) => void;
}

export const AuthPage: FC<AuthPageProps> = ({ initialScreen = 'login', onNavigate: onExternalNavigate }) => {
  const [screen, setScreen] = useState(initialScreen);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // Check for redirect result on mount (for mobile/auth flows that use redirect)
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const auth = getFirebaseAuth();
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('[Auth] Redirect sign-in successful:', result.user?.uid);
        }
      } catch (err: any) {
        console.error('[Auth] Redirect result error:', err);
        setGlobalError(err.message.replace('Firebase: ', ''));
      }
    };
    checkRedirectResult();
  }, []);

  const handleSocialLogin = async (providerName: string) => {
    setGlobalError('');
    setGlobalLoading(true);
    
    console.log(`[Auth] Attempting ${providerName} login...`);
    
    try {
      const auth = getFirebaseAuth();
      let provider;
      if (providerName === 'google') {
        provider = new GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
      } else if (providerName === 'github') {
        provider = new GithubAuthProvider();
      } else {
        throw new Error(`Unsupported provider: ${providerName}`);
      }

      // Try popup first
      try {
        console.log('[Auth] Trying signInWithPopup...');
        await signInWithPopup(auth, provider);
        console.log('[Auth] Popup sign-in successful');
      } catch (popupErr: any) {
        console.warn('[Auth] Popup failed, error:', popupErr.code, popupErr.message);
        
        // If popup is blocked or fails, fall back to redirect
        if (popupErr.code === 'auth/popup-blocked' || 
            popupErr.code === 'auth/popup-closed-by-user' ||
            popupErr.code === 'auth/cancelled-popup-request') {
          console.log('[Auth] Falling back to signInWithRedirect...');
          await signInWithRedirect(auth, provider);
          return;
        }
        
        throw popupErr;
      }
    } catch (err: any) {
      console.error(`[Auth] ${providerName} login error:`, err);
      
      let errorMessage = err.message.replace('Firebase: ', '');
      if (err.code === 'auth/unauthorized-domain') {
        errorMessage = `This domain (${window.location.hostname}) is not authorized for Google sign-in. Please add it to your Firebase Console > Authentication > Settings > Authorized domains.`;
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please allow popups for this site or try again.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed before completing the authentication.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      }
      
      setGlobalError(errorMessage);
      setGlobalLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Deep background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Floating ambient blobs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: prefersReducedMotion ? 'none' : 'authBlob1 16s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%', width: 260, height: 260,
        background: 'radial-gradient(circle, rgba(34,197,94,0.03) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: prefersReducedMotion ? 'none' : 'authBlob2 20s ease-in-out infinite alternate-reverse',
      }} />
      <div style={{
        position: 'absolute', top: '60%', left: '5%', width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(249,115,22,0.03) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: prefersReducedMotion ? 'none' : 'authBlob3 14s ease-in-out infinite alternate',
      }} />

      <style>{`
        @keyframes authBlob1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -30px) scale(1.1); }
        }
        @keyframes authBlob2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 20px) scale(1.05); }
        }
        @keyframes authBlob3 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, -40px) scale(1.08); }
        }
        @keyframes authSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Global Error */}
      {globalError && (
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          padding: '12px 20px', background: '#fee2e2', border: '1px solid #ef4444',
          borderRadius: 8, color: '#b91c1c', fontSize: 13, zIndex: 100,
          maxWidth: '90%', wordWrap: 'break-word'
        }}>
          {globalError}
          <button onClick={() => setGlobalError('')} style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Screen router */}
      {screen === 'login' && (
        <LoginScreen onNavigate={setScreen} onSocialLogin={handleSocialLogin} onExternalNavigate={onExternalNavigate} />
      )}
      {screen === 'signup' && (
        <SignupScreen onNavigate={setScreen} onSocialLogin={handleSocialLogin} onExternalNavigate={onExternalNavigate} />
      )}
      {screen === 'forgot' && (
        <ForgotScreen onNavigate={setScreen} onExternalNavigate={onExternalNavigate} />
      )}

      {/* Bottom branding */}
      <div style={{
        position: 'absolute', bottom: 24,
        fontSize: 11, color: '#333', textAlign: 'center',
        width: '100%', pointerEvents: 'none',
      }}>
        Felix Seeger &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default AuthPage;
