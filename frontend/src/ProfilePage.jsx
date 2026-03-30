import { useState, useEffect, useRef } from 'react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Floating card wrapper ─────────────────────────────────── */
function FloatCard({ children, style, delay = 0, onClick }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(20,20,20,0.6)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 16,
        padding: 28,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        willChange: 'transform',
        transition: prefersReducedMotion
          ? 'none'
          : `transform 0.4s cubic-bezier(.22,1,.36,1), border-color 0.3s ease-out, box-shadow 0.4s ease-out`,
        transform: visible
          ? hovered
            ? 'translateY(-4px) scale(1.01)'
            : 'translateY(0) scale(1)'
          : 'translateY(32px) scale(0.97)',
        opacity: visible ? 1 : 0,
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
        boxShadow: hovered
          ? '0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)'
          : '0 12px 32px rgba(0,0,0,0.25)',
        ...style,
      }}
    >
      {/* Subtle top-edge glow */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  );
}

/* ── Stat pill ─────────────────────────────────────────────── */
function StatPill({ label, value, accent = '#3b82f6', delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        display: 'flex', flexDirection: 'column', gap: 4,
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        transition: prefersReducedMotion ? 'none' : 'all 0.4s cubic-bezier(.22,1,.36,1)',
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ fontSize: 24, fontWeight: 700, color: accent, lineHeight: 1.2 }}>
        {value}
      </span>
    </div>
  );
}

/* ── Section header ────────────────────────────────────────── */
function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: 13, fontWeight: 600, color: '#555',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      margin: '0 0 16px',
    }}>
      {children}
    </h2>
  );
}

/* ── Input field ───────────────────────────────────────────── */
function Field({ label, value, readOnly, mono }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#777' }}>{label}</label>
      <input
        readOnly={readOnly}
        defaultValue={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: '#0e0e0e',
          border: `1px solid ${focused ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: 13,
          color: '#e0e0e0',
          outline: 'none',
          fontFamily: mono ? '"SF Mono","Fira Code",Menlo,monospace' : 'Inter,system-ui,sans-serif',
          transition: prefersReducedMotion ? 'none' : 'border-color 0.3s ease-out',
        }}
      />
    </div>
  );
}

/* ── Action button ─────────────────────────────────────────── */
function ActionBtn({ label, variant = 'ghost', onClick }) {
  const [hovered, setHovered] = useState(false);
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '9px 20px',
        fontSize: 13,
        fontWeight: 600,
        border: isPrimary || isDanger ? 'none' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        cursor: 'pointer',
        background: isPrimary
          ? hovered ? '#2563eb' : '#3b82f6'
          : isDanger
            ? hovered ? '#b91c1c' : '#dc2626'
            : hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        color: isPrimary || isDanger ? '#fff' : '#ccc',
        transition: prefersReducedMotion ? 'none' : 'all 0.25s ease-out',
        boxShadow: isPrimary ? '0 4px 16px rgba(59,130,246,0.25)' : 'none',
      }}
    >
      {label}
    </button>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function ProfilePage() {
  const [refHero, heroVisible] = useInView(0.1);

  // Mock data
  const user = {
    name: 'Felix Seeger',
    email: 'felix@example.com',
    avatar: null,
    plan: 'Pro',
    joined: 'Jan 2025',
  };

  const stats = [
    { label: 'Workflows', value: '12', accent: '#3b82f6' },
    { label: 'API Calls', value: '8.4k', accent: '#a78bfa' },
    { label: 'Images Gen', value: '3.2k', accent: '#22c55e' },
    { label: 'Credits', value: '1.8k', accent: '#f97316' },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0a0a0a',
        color: '#e0e0e0',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflowY: 'auto',
        overflowX: 'hidden',
        perspective: '1200px',
      }}
    >
      {/* Ambient background blobs */}
      <div style={{
        position: 'fixed', top: -120, right: -80, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        animation: prefersReducedMotion ? 'none' : 'floatBlob 12s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'fixed', bottom: -100, left: -60, width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        animation: prefersReducedMotion ? 'none' : 'floatBlob 15s ease-in-out infinite alternate-reverse',
      }} />
      <style>{`
        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 20px) scale(1.08); }
        }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 32px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Hero / Avatar section ─────────────────────────── */}
        <div
          ref={refHero}
          style={{
            display: 'flex', alignItems: 'center', gap: 28,
            marginBottom: 48,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: prefersReducedMotion ? 'none' : 'all 0.6s cubic-bezier(.22,1,.36,1)',
          }}
        >
          {/* Avatar */}
          <div style={{
            width: 88, height: 88, borderRadius: 24,
            background: 'linear-gradient(135deg, #3b82f6 0%, #a78bfa 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, fontWeight: 700, color: '#fff',
            boxShadow: '0 16px 40px rgba(59,130,246,0.25), 0 0 0 4px rgba(255,255,255,0.04)',
            flexShrink: 0,
            willChange: 'transform',
            transition: prefersReducedMotion ? 'none' : 'transform 0.4s cubic-bezier(.22,1,.36,1)',
          }}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>

          {/* Name / meta */}
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f0f0f0', margin: '0 0 4px' }}>
              {user.name}
            </h1>
            <p style={{ fontSize: 14, color: '#777', margin: '0 0 10px' }}>
              {user.email}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{
                padding: '3px 10px', fontSize: 11, fontWeight: 600,
                background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
                borderRadius: 6, letterSpacing: '0.02em',
              }}>
                {user.plan}
              </span>
              <span style={{ fontSize: 12, color: '#555', padding: '3px 0' }}>
                Member since {user.joined}
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 40,
        }}>
          {stats.map((s, i) => (
            <StatPill key={s.label} label={s.label} value={s.value} accent={s.accent} delay={i * 80} />
          ))}
        </div>

        {/* ── Two-column layout ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile Info */}
            <FloatCard delay={100}>
              <SectionTitle>Profile</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Display Name" value={user.name} />
                <Field label="Email" value={user.email} />
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <ActionBtn label="Save Changes" variant="primary" />
                  <ActionBtn label="Cancel" />
                </div>
              </div>
            </FloatCard>

            {/* API Key */}
            <FloatCard delay={200}>
              <SectionTitle>API Key</SectionTitle>
              <Field label="Production Key" value="sk-live-••••••••••••4Fj9" readOnly mono />
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <ActionBtn label="Copy" />
                <ActionBtn label="Regenerate" />
              </div>
            </FloatCard>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Plan */}
            <FloatCard delay={150}>
              <SectionTitle>Plan & Usage</SectionTitle>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0' }}>Pro Plan</div>
                  <div style={{ fontSize: 12, color: '#777', marginTop: 2 }}>$29/month &middot; Renews Apr 30</div>
                </div>
                <ActionBtn label="Upgrade" variant="primary" />
              </div>

              {/* Usage bar */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#888' }}>API Calls</span>
                  <span style={{ fontSize: 12, color: '#666' }}>8,400 / 10,000</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 3,
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '84%', height: '100%', borderRadius: 3,
                    background: 'linear-gradient(90deg, #3b82f6, #a78bfa)',
                    transition: prefersReducedMotion ? 'none' : 'width 1s cubic-bezier(.22,1,.36,1)',
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#888' }}>Storage</span>
                  <span style={{ fontSize: 12, color: '#666' }}>2.1 GB / 10 GB</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 3,
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '21%', height: '100%', borderRadius: 3,
                    background: 'linear-gradient(90deg, #22c55e, #a78bfa)',
                    transition: prefersReducedMotion ? 'none' : 'width 1s cubic-bezier(.22,1,.36,1)',
                  }} />
                </div>
              </div>
            </FloatCard>

            {/* Danger zone */}
            <FloatCard delay={250} style={{ borderColor: 'rgba(220,38,38,0.15)' }}>
              <SectionTitle>Danger Zone</SectionTitle>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5, margin: '0 0 14px' }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <ActionBtn label="Delete Account" variant="danger" />
            </FloatCard>
          </div>
        </div>
      </div>
    </div>
  );
}
