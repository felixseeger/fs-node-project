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

/* ── Floating card ─────────────────────────────────────────── */
function FloatCard({ children, style, delay = 0 }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
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
        willChange: 'transform',
        transition: prefersReducedMotion
          ? 'none'
          : 'transform 0.4s cubic-bezier(.22,1,.36,1), border-color 0.3s ease-out, box-shadow 0.4s ease-out',
        transform: visible
          ? hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)'
          : 'translateY(32px) scale(0.97)',
        opacity: visible ? 1 : 0,
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
        boxShadow: hovered
          ? '0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)'
          : '0 12px 32px rgba(0,0,0,0.25)',
        ...style,
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        pointerEvents: 'none',
      }} />
      {children}
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

/* ── Toggle switch ─────────────────────────────────────────── */
function Toggle({ label, description, defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked);
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#e0e0e0' }}>{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: '#666', marginTop: 2, lineHeight: 1.4 }}>{description}</div>
        )}
      </div>
      <button
        onClick={() => setOn(!on)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 42, height: 24, borderRadius: 12, border: 'none',
          background: on
            ? hovered ? '#2563eb' : '#3b82f6'
            : hovered ? '#333' : '#2a2a2a',
          cursor: 'pointer', position: 'relative', flexShrink: 0,
          transition: prefersReducedMotion ? 'none' : 'background 0.25s ease-out',
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3,
          left: on ? 21 : 3,
          transition: prefersReducedMotion ? 'none' : 'left 0.25s cubic-bezier(.22,1,.36,1)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}

/* ── Select dropdown ───────────────────────────────────────── */
function Select({ label, options, defaultValue }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(defaultValue);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#777' }}>{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: 32,
          transition: prefersReducedMotion ? 'none' : 'border-color 0.3s ease-out',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ── Input field ───────────────────────────────────────────── */
function Field({ label, value, mono, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: '#777' }}>{label}</label>
      <input
        defaultValue={value}
        placeholder={placeholder}
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

/* ── Sidebar nav item ──────────────────────────────────────── */
function NavItem({ label, icon, active, onClick, delay = 0 }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(null)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', padding: '10px 14px',
        background: active ? 'rgba(59,130,246,0.1)' : hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: 'none',
        borderLeft: active ? '2px solid #3b82f6' : '2px solid transparent',
        borderRadius: '0 8px 8px 0',
        color: active ? '#e0e0e0' : '#888',
        fontSize: 13, fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        textAlign: 'left',
        transition: prefersReducedMotion ? 'none' : 'all 0.25s ease-out',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-12px)',
        transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
      }}
    >
      <span style={{ fontSize: 15, width: 20, textAlign: 'center', opacity: active ? 1 : 0.6 }}>
        {icon}
      </span>
      {label}
    </button>
  );
}

/* ── Section panels ────────────────────────────────────────── */

function GeneralPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FloatCard delay={0}>
        <SectionTitle>Defaults</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Default Workflow Name Prefix" value="" placeholder="e.g., Pipeline" />
          <Select
            label="Default Canvas Background"
            defaultValue="dots"
            options={[
              { value: 'dots', label: 'Dots' },
              { value: 'lines', label: 'Lines' },
              { value: 'grid', label: 'Grid' },
              { value: 'solid', label: 'Solid' },
            ]}
          />
          <Select
            label="Auto-Save Interval"
            defaultValue="30"
            options={[
              { value: 'off', label: 'Off' },
              { value: '15', label: 'Every 15 seconds' },
              { value: '30', label: 'Every 30 seconds' },
              { value: '60', label: 'Every minute' },
            ]}
          />
        </div>
      </FloatCard>

      <FloatCard delay={80}>
        <SectionTitle>Behavior</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Toggle
            label="Auto-connect compatible nodes"
            description="Automatically suggest connections when placing nodes near each other"
            defaultChecked
          />
          <Toggle
            label="Snap to grid"
            description="Align node positions to the canvas grid"
            defaultChecked
          />
          <Toggle
            label="Confirm before deleting"
            description="Show a confirmation dialog when deleting nodes or edges"
            defaultChecked
          />
        </div>
      </FloatCard>
    </div>
  );
}

function ExecutionPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FloatCard delay={0}>
        <SectionTitle>Execution</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            label="Default Timeout"
            defaultValue="120"
            options={[
              { value: '30', label: '30 seconds' },
              { value: '60', label: '1 minute' },
              { value: '120', label: '2 minutes' },
              { value: '300', label: '5 minutes' },
              { value: '600', label: '10 minutes' },
            ]}
          />
          <Select
            label="Retry on Failure"
            defaultValue="2"
            options={[
              { value: '0', label: 'Never' },
              { value: '1', label: 'Once' },
              { value: '2', label: 'Twice' },
              { value: '3', label: '3 times' },
            ]}
          />
          <Toggle
            label="Parallel node execution"
            description="Run independent nodes simultaneously for faster workflows"
            defaultChecked
          />
          <Toggle
            label="Stop on first error"
            description="Halt execution immediately when any node fails"
            defaultChecked={false}
          />
        </div>
      </FloatCard>

      <FloatCard delay={80}>
        <SectionTitle>Logging</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            label="Log Level"
            defaultValue="info"
            options={[
              { value: 'error', label: 'Error only' },
              { value: 'warn', label: 'Warnings' },
              { value: 'info', label: 'Info' },
              { value: 'debug', label: 'Debug' },
            ]}
          />
          <Toggle
            label="Include input/output in logs"
            description="Log node inputs and outputs for debugging (may increase log size)"
            defaultChecked={false}
          />
        </div>
      </FloatCard>
    </div>
  );
}

function NotificationsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FloatCard delay={0}>
        <SectionTitle>Notifications</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Toggle
            label="Workflow completed"
            description="Notify when a workflow finishes execution"
            defaultChecked
          />
          <Toggle
            label="Workflow failed"
            description="Notify when a workflow fails during execution"
            defaultChecked
          />
          <Toggle
            label="API rate limit warning"
            description="Alert when approaching API usage limits"
            defaultChecked
          />
          <Toggle
            label="Credit balance low"
            description="Alert when credits drop below 200"
            defaultChecked
          />
        </div>
      </FloatCard>

      <FloatCard delay={80}>
        <SectionTitle>Channels</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Toggle label="In-app notifications" defaultChecked />
          <Toggle label="Email notifications" defaultChecked={false} />
          <Field label="Webhook URL (optional)" value="" placeholder="https://your-server.com/webhook" mono />
        </div>
      </FloatCard>
    </div>
  );
}

function ExportPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FloatCard delay={0}>
        <SectionTitle>Export Defaults</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            label="Default Format"
            defaultValue="json"
            options={[
              { value: 'json', label: 'JSON' },
              { value: 'yaml', label: 'YAML' },
            ]}
          />
          <Toggle
            label="Include node positions"
            description="Preserve canvas layout when exporting"
            defaultChecked
          />
          <Toggle
            label="Include credentials"
            description="Embed API keys in export (not recommended for sharing)"
            defaultChecked={false}
          />
          <Toggle
            label="Pretty-print JSON"
            description="Format exported JSON with indentation"
            defaultChecked
          />
        </div>
      </FloatCard>

      <FloatCard delay={80}>
        <SectionTitle>Import</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Toggle
            label="Validate on import"
            description="Check node compatibility and edge validity before importing"
            defaultChecked
          />
          <Toggle
            label="Auto-layout imported nodes"
            description="Reorganize nodes after import to avoid overlaps"
            defaultChecked
          />
        </div>
      </FloatCard>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
const TABS = [
  { id: 'general', label: 'General', icon: '⚙' },
  { id: 'execution', label: 'Execution', icon: '▶' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'export', label: 'Export / Import', icon: '↗' },
];

export default function WorkflowSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [refHero, heroVisible] = useInView(0.1);

  const panels = {
    general: <GeneralPanel />,
    execution: <ExecutionPanel />,
    notifications: <NotificationsPanel />,
    export: <ExportPanel />,
  };

  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: '#0a0a0a', color: '#e0e0e0',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflowY: 'auto', overflowX: 'hidden',
        perspective: '1200px',
      }}
    >
      {/* Ambient blobs */}
      <div style={{
        position: 'fixed', top: -100, left: -60, width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        animation: prefersReducedMotion ? 'none' : 'floatBlob 14s ease-in-out infinite alternate',
      }} />
      <div style={{
        position: 'fixed', bottom: -80, right: -40, width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        animation: prefersReducedMotion ? 'none' : 'floatBlob 18s ease-in-out infinite alternate-reverse',
      }} />
      <style>{`
        @keyframes floatBlob {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(25px, 15px) scale(1.06); }
        }
      `}</style>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 32px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Hero header ──────────────────────────────────── */}
        <div
          ref={refHero}
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            marginBottom: 40,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'none' : 'all 0.6s cubic-bezier(.22,1,.36,1)',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #a78bfa 0%, #3b82f6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
            boxShadow: '0 12px 32px rgba(167,139,250,0.2), 0 0 0 3px rgba(255,255,255,0.03)',
          }}>
            ⚙
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f0f0', margin: '0 0 2px' }}>
              Workflow Settings
            </h1>
            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
              Configure defaults, execution behavior, and notifications
            </p>
          </div>
        </div>

        {/* ── Sidebar + Content layout ────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 28 }}>

          {/* Sidebar nav */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TABS.map((tab, i) => (
              <NavItem
                key={tab.id}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                delay={i * 60}
              />
            ))}
          </div>

          {/* Active panel */}
          <div>
            {panels[activeTab]}

            {/* Save bar */}
            <div style={{
              display: 'flex', gap: 8, marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <ActionBtn label="Save Settings" variant="primary" />
              <ActionBtn label="Reset to Defaults" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
