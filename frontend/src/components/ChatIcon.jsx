export default function ChatIcon({ isOpen, onClick, unreadCount = 0 }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        right: 24,
        bottom: 80, // Position above the BottomBar
        zIndex: 2000,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: isOpen ? '#3b82f6' : '#2a2a2a',
        border: `1px solid ${isOpen ? '#3b82f6' : '#444'}`,
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isOpen 
          ? '0 4px 20px rgba(59, 130, 246, 0.4)' 
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease',
        pointerEvents: 'auto',
      }}
      onMouseEnter={(e) => {
        if (!isOpen) {
          e.currentTarget.style.background = '#333';
          e.currentTarget.style.borderColor = '#555';
          e.currentTarget.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isOpen) {
          e.currentTarget.style.background = '#2a2a2a';
          e.currentTarget.style.borderColor = '#444';
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      title={isOpen ? 'Close chat' : 'Open chat'}
    >
      {/* Chat Icon SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>

      {/* Unread Badge */}
      {unreadCount > 0 && !isOpen && (
        <div
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#ef4444',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #1a1a1a',
          }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}

      {/* Active indicator dot */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #3b82f6',
          }}
        />
      )}
    </button>
  );
}
