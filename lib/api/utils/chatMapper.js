/**
 * Utility for mapping between Firestore chat objects and the filesystem markdown structure.
 */

/**
 * Converts a chat session and its messages into the markdown string format defined in chats/README.md.
 *
 * @param {Object} chat The chat session metadata (id, title, createdAt, updatedAt, etc.)
 * @param {Array} messages An array of message objects {role, content, createdAt, ...}
 * @returns {string} The formatted markdown string representing the conversation.
 */
export function chatToMarkdown(chat, messages = []) {
  if (!chat || !chat.id) {
    throw new Error('Invalid chat object provided to chatToMarkdown');
  }

  const title = chat.title || 'Untitled Conversation';
  const createdAt = chat.createdAt ? new Date(chat.createdAt).toISOString() : 'Unknown';
  const updatedAt = chat.updatedAt ? new Date(chat.updatedAt).toISOString() : 'Unknown';

  let markdown = `# Chat: ${title}\n`;
  markdown += `> ID: ${chat.id}\n`;
  if (chat.workflowId) {
    markdown += `> Workflow ID: ${chat.workflowId}\n`;
  }
  markdown += `> Created: ${createdAt} | Updated: ${updatedAt}\n\n`;

  // Sort messages by creation time
  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeA - timeB;
  });

  for (const msg of sortedMessages) {
    const role = msg.role ? msg.role.charAt(0).toUpperCase() + msg.role.slice(1) : 'Unknown';
    const timestamp = msg.createdAt ? new Date(msg.createdAt).toISOString() : 'Unknown Time';
    
    markdown += `## [${role}] ${timestamp}\n\n`;
    // Add the content, ensuring it ends with exactly two newlines
    markdown += `${(msg.content || '').trim()}\n\n`;
  }

  return markdown;
}

/**
 * Parses the structured markdown format back into an array of message objects.
 * Note: The overall chat metadata is expected to be loaded from meta.json.
 *
 * @param {string} markdownContent The content of index.md
 * @returns {Array} An array of message objects { role, content, createdAt }
 */
export function markdownToMessages(markdownContent) {
  if (!markdownContent || typeof markdownContent !== 'string') {
    return [];
  }

  const messages = [];
  // Regex to match the header: ## [Role] Timestamp
  // Example: ## [Assistant] 2026-04-12T10:05:00.000Z
  const headerRegex = /^##\s+\[(.*?)\]\s+(.*?)$/gm;
  
  let match;
  let lastIndex = 0;
  let currentMessage = null;

  while ((match = headerRegex.exec(markdownContent)) !== null) {
    // If we have an active message, its content is the text between the last header and this one
    if (currentMessage) {
      currentMessage.content = markdownContent.substring(lastIndex, match.index).trim();
      messages.push(currentMessage);
    }

    // Start a new message
    const role = match[1].toLowerCase();
    const createdAt = match[2];
    
    currentMessage = {
      role,
      createdAt,
      content: ''
    };
    
    // Update lastIndex to point to the character right after the current header
    lastIndex = headerRegex.lastIndex;
  }

  // Handle the last message in the file
  if (currentMessage) {
    currentMessage.content = markdownContent.substring(lastIndex).trim();
    messages.push(currentMessage);
  }

  return messages;
}

/**
 * Generates the metadata object to be saved as meta.json.
 *
 * @param {Object} chat The chat session object
 * @param {Array} messages The array of messages
 * @returns {Object} The metadata object ready to be stringified to JSON
 */
export function generateChatMetadata(chat, messages = []) {
  if (!chat || !chat.id || !chat.userId) {
      throw new Error('Invalid chat object provided: missing required fields (id, userId)');
  }
  
  return {
    id: chat.id,
    userId: chat.userId,
    title: chat.title || 'Untitled Conversation',
    workflowId: chat.workflowId || null,
    createdAt: chat.createdAt ? new Date(chat.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: chat.updatedAt ? new Date(chat.updatedAt).toISOString() : new Date().toISOString(),
    messageCount: messages.length
  };
}
