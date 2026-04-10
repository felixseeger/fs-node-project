import { useState } from 'react';
import { improvePromptGenerate, pollImprovePromptStatus } from '../utils/api';

export type ImprovePromptMediaType = 'image' | 'video' | 'audio';

export interface ImprovePromptButtonProps {
  id: string;
  data: Record<string, unknown> & {
    resolveInput?: (nodeId: string, handleKey: string) => unknown;
  };
  update: (patch: Record<string, unknown>) => void;
  promptKey?: string;
  type?: ImprovePromptMediaType;
}

export default function ImprovePromptButton({
  id,
  data,
  update,
  promptKey = 'inputPrompt',
  type = 'image',
}: ImprovePromptButtonProps) {
  const [isImproving, setIsImproving] = useState(false);

  const handleImprovePrompt = async () => {
    const fromResolve = data.resolveInput?.(id, 'prompt-in');
    const prompt =
      (typeof fromResolve === 'string' ? fromResolve : '') ||
      (typeof data[promptKey] === 'string' ? data[promptKey] : '') ||
      '';

    setIsImproving(true);
    try {
      const params = { prompt, type, language: 'en' };
      const result = await improvePromptGenerate(params);

      if (result.error) {
        throw new Error(
          result.error?.message || JSON.stringify(result.error) || 'Error improving prompt'
        );
      }

      const taskId = result.task_id || result.data?.task_id;
      let promptText = '';
      if (taskId) {
        const status = await pollImprovePromptStatus(taskId);
        promptText = status.data?.generated?.[0] || '';
      } else if (result.data?.generated?.length) {
        promptText = result.data.generated[0];
      }

      if (promptText) {
        update({ [promptKey]: promptText });
      }
    } catch (err: unknown) {
      console.error('Improve prompt error:', err);
      const message = err instanceof Error ? err.message : String(err);
      alert(`Failed to improve prompt: ${message}`);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleImprovePrompt}
      disabled={isImproving}
      title="Improve prompt with AI"
      style={{
        fontSize: 9,
        color: isImproving ? '#999' : '#14b8a6',
        padding: '2px 6px',
        background: isImproving ? '#333' : 'rgba(20,184,166,0.15)',
        borderRadius: 4,
        border: `1px solid ${isImproving ? '#444' : 'rgba(20,184,166,0.3)'}`,
        cursor: isImproving ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isImproving ? '#999' : '#14b8a6'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: 2 }}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {isImproving ? 'Improving...' : 'Improve'}
    </button>
  );
}
