/**
 * Sanitization Unit Tests
 * Tests for the enhanced sanitization utilities with XSS prevention
 */

import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizeChatMessage } from '../../utils/sanitization';

describe('XSS Prevention - sanitizeHTML', () => {
  const xssVectors = [
    { name: 'Basic script tag', input: '<script>alert("XSS")</script>Text', expected: 'Text' },
    { name: 'Image onerror', input: '<img src=x onerror="alert(1)">', expected: '' },
    { name: 'SVG onload', input: '<svg onload="alert(1)"/>', expected: '' },
    { name: 'Iframe injection', input: '<iframe src="https://evil.com"></iframe>', expected: '' },
    { name: 'JavaScript protocol', input: '<a href="javascript:alert(1)">Link</a>', expected: 'Link' },
    { name: 'Data URI', input: '<a href="data:text/html,<script>alert(1)</script>">Link</a>', expected: 'Link' },
    { name: 'Event handler', input: '<div onclick="alert(1)">Click me</div>', expected: 'Click me' },
    { name: 'Style injection', input: '<div style="background:url(javascript:alert(1))">Text</div>', expected: 'Text' },
    { name: 'Object tag', input: '<object data="https://evil.com"></object>', expected: '' },
    { name: 'Embed tag', input: '<embed src="https://evil.com">', expected: '' },
    { name: 'Form injection', input: '<form action="https://evil.com"><input type="submit"></form>', expected: '' },
    { name: 'Meta refresh', input: '<meta http-equiv="refresh" content="0;url=https://evil.com">', expected: '' },
  ];

  xssVectors.forEach(({ name, input, expected }) => {
    it(`should neutralize: ${name}`, () => {
      const result = sanitizeHTML(input);
      expect(result).toBe(expected);
      expect(result).not.toContain('<script');
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('onload');
    });
  });

  it('should preserve legitimate text', () => {
    const text = 'Hello, world! This is a normal message with no HTML.';
    expect(sanitizeHTML(text)).toBe(text);
  });

  it('should handle unicode and emojis', () => {
    const text = 'Hello 👋 你好 🎉';
    expect(sanitizeHTML(text)).toBe(text);
  });
});

describe('Chat Message Sanitization', () => {
  it('should reject empty messages', () => {
    const result = sanitizeChatMessage('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Message is required');
  });

  it('should reject messages over limit', () => {
    const result = sanitizeChatMessage('a'.repeat(2001), 2000);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('2000 character limit');
  });

  it('should strip HTML and return clean text', () => {
    const result = sanitizeChatMessage('<b>Hello</b> <script>evil()</script>World');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Hello World');
  });

  it('should remove control characters', () => {
    const result = sanitizeChatMessage('Hello\x00\x01\x02World');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('HelloWorld');
  });

  it('should remove zero-width characters', () => {
    const result = sanitizeChatMessage('Hello\u200B\u200C\u200DWorld');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('HelloWorld');
  });

  it('should accept valid messages', () => {
    const result = sanitizeChatMessage('This is a valid message!');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('This is a valid message!');
  });
});
