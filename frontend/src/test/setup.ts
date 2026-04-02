import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock import.meta.env
vi.mock('import.meta.env', () => ({
  PROD: false,
  DEV: true,
}));

// Mock console methods in test environment to reduce noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: unknown[]) => {
  // Filter out React 19 act() warnings and other known warnings
  const message = String(args[0]);
  if (
    message.includes('Warning: ReactDOM.render is no longer supported') ||
    message.includes('Warning: `ReactDOMTestUtils.act`') ||
    message.includes('act(...) is not supported in production builds')
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args: unknown[]) => {
  const message = String(args[0]);
  // Filter out known warnings
  if (
    message.includes('React.createFactory') ||
    message.includes('componentWillReceiveProps')
  ) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Extend matchers
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeInTheDocument(): void;
    toHaveClass(className: string): void;
    toHaveAttribute(attr: string, value?: string): void;
    toHaveTextContent(text: string | RegExp): void;
    toBeVisible(): void;
    toBeDisabled(): void;
    toBeEnabled(): void;
  }
}
