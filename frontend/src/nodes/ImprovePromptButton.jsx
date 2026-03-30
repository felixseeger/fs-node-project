import { useState } from 'react';
import { improvePromptGenerate, pollImprovePromptStatus } from '../utils/api';

export default function ImprovePromptButton({ id, data, update, promptKey = 'inputPrompt', type = 'image' }) {
  const [isImproving, setIsImproving] = useState(false);

  const handleImprovePrompt = async () => {
    const prompt = data.resolveInput?.(id, 'prompt-in') || data[promptKey] || '';
    // if (!prompt) {
    //   alert('Please provide a prompt to improve.');
    //   return;
    // } // Empty prompts are allowed per documentation for "creative generation from scratch".

    setIsImproving(true);
    try {
      const params = { prompt, type, language: 'en' };
      const result = await improvePromptGenerate(params);
      
      if (result.error) {
        throw new Error(result.error?.message || JSON.stringify(result.error) || 'Error improving prompt');
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
    } catch (err) {
      console.error('Improve prompt error:', err);
      alert('Failed to improve prompt: ' + err.message);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <button 
      onClick={handleImprovePrompt} 
      disabled={isImproving}
      title="Improve prompt with AI"
      style={{
        fontSize: 9, color: isImproving ? '#999' : '#14b8a6', padding: '2px 6px', 
        background: isImproving ? '#333' : 'rgba(20,184,166,0.15)', 
        borderRadius: 4, border: `1px solid ${isImproving ? '#444' : 'rgba(20,184,166,0.3)'}`, 
        cursor: isImproving ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 4
      }}
    >
      {isImproving ? '🪄 Improving...' : '🪄 Improve'}
    </button>
  );
}
