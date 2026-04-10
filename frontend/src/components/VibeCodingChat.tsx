import React, { useState, useRef, useEffect, useCallback, FC, FormEvent, ChangeEvent } from 'react';
// @ts-ignore
import { useStore } from '../store';
// @ts-ignore
import { generateWorkflowFromPrompt } from '../utils/aiWorkflowGenerator';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isGenerating?: boolean;
}

interface VibeCodingChatProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * VibeCodingChat - AI-powered chat interface for workflow generation
 * Enables natural language to workflow conversion
 */
const VibeCodingChat: FC<VibeCodingChatProps> = ({ isOpen, onClose }) => {
  const { addNodes, addEdges, setWorkflow } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', sender: 'ai', text: 'Hello! I\'m your AI workflow assistant. Describe what you want to create and I\'ll generate the workflow for you.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    // Add user message
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsGenerating(true);
    setError(null);

    try {
      // Add a temporary AI generating message
      const aiMessage: Message = { id: 'generating', sender: 'ai', text: 'Generating your workflow...', isGenerating: true };
      setMessages(prev => [...prev, aiMessage]);

      const workflow = await generateWorkflowFromPrompt({
        prompt: currentInput,
        providerPreferences: ['freepik', 'anthropic'],
        constraints: { maxNodes: 12 }
      });

      // Apply workflow to canvas
      if (workflow.nodes && workflow.nodes.length > 0) {
        addNodes(workflow.nodes);
        if (workflow.edges) {
          addEdges(workflow.edges);
        }
        setWorkflow({ name: `Generated: ${currentInput.substring(0, 30)}...`, nodes: workflow.nodes, edges: workflow.edges });

        // Update AI message with success
        setMessages(prev => [
          ...prev.slice(0, -1),
          { id: 'success', sender: 'ai', text: `✨ Workflow generated! I\'ve created ${workflow.nodes.length} nodes and ${workflow.edges?.length || 0} connections for your "${currentInput}" request.` }
        ]);
      } else {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { id: 'error', sender: 'ai', text: 'Sorry, I couldn\'t generate a workflow from that request. Could you try being more specific?' }
        ]);
      }
    } catch (err) {
      console.error('Workflow generation error:', err);
      setError('Failed to generate workflow. Please try again.');
      setMessages(prev => [
        ...prev.slice(0, -1),
        { id: 'error', sender: 'ai', text: 'Oops! Something went wrong while generating your workflow. Please try again.' }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle quick suggestion clicks
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  // Quick suggestions for common workflows
  const suggestions = [
    'Create a surreal landscape with vibrant colors',
    'Generate a cyberpunk cityscape at night',
    'Design a fantasy character portrait',
    'Make an abstract 3D composition',
    'Produce a vintage travel poster',
    'Develop a futuristic UI concept'
  ];

  if (!isOpen) return null;

  return (
    <div className="vibe-coding-chat fixed right-4 bottom-20 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden" style={{ zIndex: 10000 }}>
      <div className="chat-header flex justify-between items-center p-3 bg-gray-900 border-b border-gray-700">
        <h3 className="text-white font-semibold text-sm">🤖 Vibe Coding Assistant</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="chat-messages h-80 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block max-w-xs p-3 rounded-lg text-sm ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              {message.isGenerating ? (
                <span className="flex items-center">
                  <span className="animate-pulse mr-2">●</span>
                  {message.text}
                </span>
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-3 pb-2">
          <div className="bg-red-900 text-red-100 p-2 rounded text-sm text-center">
            {error}
          </div>
        </div>
      )}

      <div className="chat-input p-3 border-t border-gray-700 bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-2">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors truncate"
                title={suggestion}
                style={{ flex: 1, minWidth: 0 }}
              >
                {suggestion.length > 15 ? suggestion.substring(0, 15) + '...' : suggestion}
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              placeholder="Describe your workflow..."
              disabled={isGenerating}
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none text-sm"
              aria-label="Workflow description input"
            />
            <button
              type="submit"
              disabled={isGenerating || !inputValue.trim()}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                isGenerating || !inputValue.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              aria-label="Generate workflow"
            >
              {isGenerating ? '...' : 'Go'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setMessages([messages[0]])}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
            disabled={isGenerating}
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default VibeCodingChat;
