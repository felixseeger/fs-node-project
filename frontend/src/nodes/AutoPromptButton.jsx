import { useState } from 'react';
import { imageToPromptGenerate, pollImageToPromptStatus } from '../utils/api';

export default function AutoPromptButton({ id, data, update, imageKey = 'image-in', localImageKey = 'localImage', promptKey = 'inputPrompt' }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAutoPrompt = async () => {
    let images = data.resolveInput?.(id, imageKey);
    if (!images?.length && data[localImageKey]) images = [data[localImageKey]];

    if (!images?.length) {
      alert('Please provide an image first to generate a prompt.');
      return;
    }

    setIsGenerating(true);
    try {
      const params = { image: images[0] };
      const result = await imageToPromptGenerate(params);
      
      if (result.error) {
        throw new Error(result.error?.message || JSON.stringify(result.error) || 'Error generating prompt');
      }

      const taskId = result.task_id || result.data?.task_id;
      let promptText = '';
      if (taskId) {
        const status = await pollImageToPromptStatus(taskId);
        promptText = status.data?.generated?.[0] || '';
      } else if (result.data?.generated?.length) {
        promptText = result.data.generated[0];
      }
      
      if (promptText) {
        update({ [promptKey]: promptText });
      }
    } catch (err) {
      console.error('Auto-prompt error:', err);
      alert('Failed to generate prompt: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleAutoPrompt} 
      disabled={isGenerating}
      title="Auto-generate prompt from image"
      style={{
        fontSize: 9, color: isGenerating ? '#999' : '#f59e0b', padding: '2px 6px', 
        background: isGenerating ? '#333' : 'rgba(245,158,11,0.15)', 
        borderRadius: 4, border: `1px solid ${isGenerating ? '#444' : 'rgba(245,158,11,0.3)'}`, 
        cursor: isGenerating ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 4
      }}
    >
      {isGenerating ? '✨ Gen...' : '✨ Auto-Prompt'}
    </button>
  );
}
