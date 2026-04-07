/**
 * ThemeToggle Component
 * A premium, animated toggle for switching between light and dark modes.
 */
export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        display: 'flex',
        alignItems: 'center',
        padding: 2,
        boxShadow: isDark ? 'inset 0 1px 4px rgba(0,0,0,0.2)' : 'inset 0 1px 4px rgba(0,0,0,0.05)',
      }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          background: isDark ? '#fff' : '#0f172a',
          transform: `translateX(${isDark ? '20' : '0'}px)`,
          transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          color: isDark ? '#000' : '#fff',
        }}
      >
        {isDark ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.07" x2="5.64" y2="17.66"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="7.22"></line>
          </svg>
        )}
      </div>
    </button>
  );
}
