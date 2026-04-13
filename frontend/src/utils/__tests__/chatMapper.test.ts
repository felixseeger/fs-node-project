import { chatToMarkdown, markdownToMessages, generateChatMetadata } from '../../../../lib/api/utils/chatMapper.js';
import { describe, it, expect } from 'vitest';

describe('chatMapper', () => {
  const mockChat = {
    id: 'test-chat-123',
    userId: 'user-456',
    title: 'Test Conversation',
    workflowId: 'wf-789',
    createdAt: new Date('2026-04-12T10:00:00.000Z'),
    updatedAt: new Date('2026-04-12T10:05:00.000Z'),
  };

  const mockMessages = [
    {
      role: 'user',
      content: 'Can you help me build a video workflow?',
      createdAt: new Date('2026-04-12T10:01:00.000Z')
    },
    {
      role: 'assistant',
      content: 'Sure! Here is a simple video generation workflow:\n\n```json\n{\n  "nodes": []\n}\n```\n\n![Generated Video](attachments/vid-123.mp4)',
      createdAt: new Date('2026-04-12T10:02:00.000Z')
    }
  ];

  describe('chatToMarkdown', () => {
    it('should generate formatted markdown from chat and messages', () => {
      const markdown = chatToMarkdown(mockChat, mockMessages);
      
      expect(markdown).toContain('# Chat: Test Conversation');
      expect(markdown).toContain('> ID: test-chat-123');
      expect(markdown).toContain('> Workflow ID: wf-789');
      expect(markdown).toContain('## [User] 2026-04-12T10:01:00.000Z');
      expect(markdown).toContain('Can you help me build a video workflow?');
      expect(markdown).toContain('## [Assistant] 2026-04-12T10:02:00.000Z');
      expect(markdown).toContain('![Generated Video](attachments/vid-123.mp4)');
    });

    it('should throw an error if chat object is invalid', () => {
      expect(() => chatToMarkdown(null, [])).toThrow('Invalid chat object');
      expect(() => chatToMarkdown({}, [])).toThrow('Invalid chat object');
    });
  });

  describe('markdownToMessages', () => {
    it('should parse markdown string back to message objects', () => {
      const markdown = `
# Chat: Test
> ID: 123

## [User] 2026-04-12T10:00:00.000Z

First message content.

## [Assistant] 2026-04-12T10:01:00.000Z

Second message content with some
newlines.
`;
      const messages = markdownToMessages(markdown);
      
      expect(messages.length).toBe(2);
      expect(messages[0].role).toBe('user');
      expect(messages[0].createdAt).toBe('2026-04-12T10:00:00.000Z');
      expect(messages[0].content).toBe('First message content.');
      
      expect(messages[1].role).toBe('assistant');
      expect(messages[1].createdAt).toBe('2026-04-12T10:01:00.000Z');
      expect(messages[1].content).toBe('Second message content with some\nnewlines.');
    });

    it('should handle empty or invalid markdown', () => {
      expect(markdownToMessages('')).toEqual([]);
      expect(markdownToMessages(null)).toEqual([]);
      expect(markdownToMessages('Just some random text without headers')).toEqual([]);
    });
  });

  describe('generateChatMetadata', () => {
    it('should generate a correct metadata JSON object', () => {
      const meta = generateChatMetadata(mockChat, mockMessages);
      
      expect(meta.id).toBe('test-chat-123');
      expect(meta.userId).toBe('user-456');
      expect(meta.title).toBe('Test Conversation');
      expect(meta.workflowId).toBe('wf-789');
      expect(meta.messageCount).toBe(2);
      expect(meta.createdAt).toBe('2026-04-12T10:00:00.000Z');
    });

    it('should throw error if required fields are missing', () => {
      expect(() => generateChatMetadata({ id: '123' }, [])).toThrow('Invalid chat object');
    });
  });
});
