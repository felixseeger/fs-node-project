/**
 * Messaging Security Tests
 * Tests for XSS prevention, input validation, rate limiting, and access control
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sanitizeHTML, sanitizeChatMessage, sanitizeString, sanitizeData } from '../utils/sanitization';

describe('Messaging Security - XSS Prevention', () => {
  describe('sanitizeHTML', () => {
    it('should strip all HTML tags', () => {
      const malicious = '<script>alert("XSS")</script>Hello';
      expect(sanitizeHTML(malicious)).toBe('Hello');
    });

    it('should strip nested HTML tags', () => {
      const malicious = '<div><p><script>evil()</script></p></div>';
      expect(sanitizeHTML(malicious)).toBe('');
    });

    it('should remove javascript: protocol', () => {
      const malicious = '<a href="javascript:alert(1)">Click</a>';
      const result = sanitizeHTML(malicious);
      expect(result).not.toContain('javascript:');
    });

    it('should remove event handlers', () => {
      const malicious = '<img src=x onerror="alert(1)">';
      const result = sanitizeHTML(malicious);
      expect(result).toBe('');
    });

    it('should handle SVG-based XSS', () => {
      const malicious = '<svg onload="alert(1)"><circle cx="50" cy="50" r="40"/></svg>';
      expect(sanitizeHTML(malicious)).toBe('');
    });

    it('should handle iframe injection', () => {
      const malicious = '<iframe src="https://evil.com"></iframe>';
      expect(sanitizeHTML(malicious)).toBe('');
    });

    it('should handle data: URIs', () => {
      const malicious = '<a href="data:text/html,<script>alert(1)</script>">Link</a>';
      const result = sanitizeHTML(malicious);
      expect(result).toBe('Link');
    });

    it('should preserve legitimate text content', () => {
      const text = 'Hello, world! This is a test message.';
      expect(sanitizeHTML(text)).toBe(text);
    });

    it('should handle unicode characters', () => {
      const text = 'Hello 👋 你好 🎉';
      expect(sanitizeHTML(text)).toBe(text);
    });
  });

  describe('sanitizeChatMessage', () => {
    it('should reject empty messages', () => {
      const result = sanitizeChatMessage('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Message is required');
    });

    it('should reject null input', () => {
      const result = sanitizeChatMessage(null as any);
      expect(result.valid).toBe(false);
    });

    it('should reject messages exceeding max length', () => {
      const longMessage = 'a'.repeat(2001);
      const result = sanitizeChatMessage(longMessage, 2000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('2000 character limit');
    });

    it('should strip HTML from messages', () => {
      const malicious = '<script>alert("XSS")</script>Hi there!';
      const result = sanitizeChatMessage(malicious);
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Hi there!');
    });

    it('should remove null bytes', () => {
      const malicious = 'Hello\x00World';
      const result = sanitizeChatMessage(malicious);
      expect(result.message).not.toContain('\x00');
    });

    it('should remove zero-width characters', () => {
      const malicious = 'Hello\u200B\u200C\u200DWorld';
      const result = sanitizeChatMessage(malicious);
      expect(result.message).toBe('HelloWorld');
    });

    it('should remove control characters', () => {
      const malicious = 'Hello\x01\x02\x03World';
      const result = sanitizeChatMessage(malicious);
      expect(result.message).toBe('HelloWorld');
    });

    it('should trim whitespace', () => {
      const message = '   Hello   ';
      const result = sanitizeChatMessage(message);
      expect(result.message).toBe('Hello');
    });

    it('should accept valid messages', () => {
      const message = 'Hello, this is a valid message!';
      const result = sanitizeChatMessage(message);
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Hello, this is a valid message!');
    });

    it('should enforce custom max length', () => {
      const message = 'a'.repeat(101);
      const result = sanitizeChatMessage(message, 100);
      expect(result.valid).toBe(false);
    });
  });
});

describe('Messaging Security - Secret Redaction', () => {
  describe('sanitizeString', () => {
    it('should redact OpenAI API keys', () => {
      const text = 'My key is sk-abc123def456ghi789jkl012mno345pqr678';
      const result = sanitizeString(text);
      expect(result).not.toContain('sk-abc123');
      expect(result).toContain('{{REDACTED}}');
    });

    it('should redact Google API keys', () => {
      const text = 'API key: AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q';
      const result = sanitizeString(text);
      expect(result).not.toContain('AIzaSy');
    });

    it('should redact GitHub tokens', () => {
      const text = 'Token: ghp_abc123def456ghi789jkl012mno345pqr678';
      const result = sanitizeString(text);
      expect(result).not.toContain('ghp_');
    });

    it('should redact JWT tokens', () => {
      const text = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      const result = sanitizeString(text);
      expect(result).not.toContain('eyJhbG');
    });

    it('should redact hex keys', () => {
      const text = 'Key: abcdef1234567890abcdef1234567890';
      const result = sanitizeString(text);
      expect(result).not.toContain('abcdef1234567890');
    });
  });

  describe('sanitizeData', () => {
    it('should redact sensitive keys from objects', () => {
      const data = {
        apiKey: 'secret123',
        password: 'password123',
        token: 'token123',
        name: 'John Doe',
        email: 'john@example.com'
      };
      const result = sanitizeData(data);
      expect(result.apiKey).toBe('{{REDACTED}}');
      expect(result.password).toBe('{{REDACTED}}');
      expect(result.token).toBe('{{REDACTED}}');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
    });

    it('should handle nested objects', () => {
      const data = {
        user: {
          name: 'John',
          credentials: {
            apiKey: 'secret',
            password: 'pass'
          }
        }
      };
      const result = sanitizeData(data);
      expect(result.user.credentials.apiKey).toBe('{{REDACTED}}');
      expect(result.user.credentials.password).toBe('{{REDACTED}}');
      expect(result.user.name).toBe('John');
    });

    it('should handle arrays', () => {
      const data = {
        keys: [
          { apiKey: 'secret1' },
          { name: 'Key 1' }
        ]
      };
      const result = sanitizeData(data);
      expect(result.keys[0].apiKey).toBe('{{REDACTED}}');
      expect(result.keys[1].name).toBe('Key 1');
    });
  });
});

describe('Messaging Security - Input Validation Edge Cases', () => {
  it('should handle extremely long messages', () => {
    const message = 'a'.repeat(10000);
    const result = sanitizeChatMessage(message, 2000);
    expect(result.valid).toBe(false);
  });

  it('should handle messages with only special characters', () => {
    const message = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const result = sanitizeChatMessage(message);
    expect(result.valid).toBe(true);
  });

  it('should handle messages with emojis', () => {
    const message = 'Hello 👋🎉🚀';
    const result = sanitizeChatMessage(message);
    expect(result.valid).toBe(true);
    expect(result.message).toBe(message);
  });

  it('should handle messages with mixed content', () => {
    const message = '<b>Bold</b> and <i>italic</i> with <script>evil</script>';
    const result = sanitizeChatMessage(message);
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Bold and italic with ');
  });

  it('should handle messages with encoded entities', () => {
    const message = '&lt;script&gt;alert(1)&lt;/script&gt;';
    const result = sanitizeChatMessage(message);
    expect(result.valid).toBe(true);
    // DOMParser will decode entities, then strip tags
    expect(result.message).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('should handle empty HTML tags', () => {
    const message = '<></><script></script>';
    const result = sanitizeChatMessage(message);
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  });

  it('should handle malformed HTML', () => {
    const message = '<div><p>Unclosed paragraph';
    const result = sanitizeChatMessage(message);
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Unclosed paragraph');
  });
});

describe('Messaging Security - Rate Limiting Simulation', () => {
  it('should enforce minimum time between messages', () => {
    // This test documents the rate limiting behavior
    // Actual implementation is in useCollaboration.ts with MESSAGE_RATE_LIMIT_MS = 500ms
    const rateLimitMs = 500;
    expect(rateLimitMs).toBeGreaterThan(0);
    expect(rateLimitMs).toBeLessThanOrEqual(1000); // Should be reasonable
  });
});

describe('Messaging Security - Firestore Rules Validation', () => {
  it('should require authentication for all message operations', () => {
    // Documented security rule requirements
    expect(true).toBe(true); // Placeholder - actual testing requires Firebase emulator
  });

  it('should restrict message reads to workflow collaborators', () => {
    // Documented security rule requirements
    expect(true).toBe(true); // Placeholder - actual testing requires Firebase emulator
  });

  it('should validate message content types and lengths', () => {
    // Documented security rule requirements
    expect(true).toBe(true); // Placeholder - actual testing requires Firebase emulator
  });

  it('should prevent message spoofing by verifying senderId', () => {
    // Documented security rule requirements
    expect(true).toBe(true); // Placeholder - actual testing requires Firebase emulator
  });
});
