import { NodeExecutor } from './types';

export const conditionExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);
  const inputValue = inputs['input'] as string | undefined;
  
  const operator = (data.operator as string) || 'contains';
  const conditionValue = (data.conditionValue as string) || '';
  
  let result = false;
  if (inputValue !== undefined && inputValue !== null) {
    const inputStr = String(inputValue).toLowerCase();
    const condStr = conditionValue.toLowerCase();
    
    switch (operator) {
      case 'contains':
        result = inputStr.includes(condStr);
        break;
      case 'equals':
        result = inputStr === condStr;
        break;
      case 'starts_with':
        result = inputStr.startsWith(condStr);
        break;
      case 'ends_with':
        result = inputStr.endsWith(condStr);
        break;
      case 'regex':
        try {
          const regex = new RegExp(conditionValue);
          result = regex.test(String(inputValue));
        } catch (e) {
          result = false;
        }
        break;
    }
  }

  // Update node display state
  context.updateNodeData(node.id, { 
    conditionResult: result,
    evaluatedInput: inputValue 
  });
  
  // A true result passes the input along the 'true_out' edge, false along 'false_out'
  if (result) {
    return { true_out: inputValue };
  } else {
    return { false_out: inputValue };
  }
};

export const iterationExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);
  const items = inputs['array_in'] as any[] | undefined;
  
  if (!Array.isArray(items)) {
    throw new Error('IterationNode requires an array input');
  }

  const maxIter = Number(data.maxIterations) || 10;
  const processItems = items.slice(0, maxIter);

  context.updateNodeData(node.id, { 
    itemsCount: items.length,
    processedCount: processItems.length 
  });

  return { item_out: processItems };
};

export const variableExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);
  const inputValue = inputs['val_in'];

  // Either read from input or use the configured fallback
  const valueToStore = inputValue !== undefined ? inputValue : data.varValue;

  context.updateNodeData(node.id, { 
    storedValue: valueToStore 
  });

  return { val_out: valueToStore };
};

export const socialPublisherExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);
  const mediaUrl = inputs['media_in'] || data.localMediaUrl;
  const caption = (inputs['caption_in'] || data.caption) as string;
  const platform = data.platform as string;

  if (!mediaUrl) {
    throw new Error('SocialPublisherNode requires media input');
  }

  // Simulate publishing
  context.log('info', `Simulating post to ${platform}`, { mediaUrl, caption });
  await new Promise(resolve => setTimeout(resolve, 1500));

  const successMessage = `Successfully posted to ${platform}`;
  context.updateNodeData(node.id, { 
    publishStatus: 'success',
    publishedUrl: `https://${platform}.com/post/mock-id` 
  });

  return { result: successMessage };
};

export const cloudSyncExecutor: NodeExecutor = async (node, context) => {
  const data = node.data as Record<string, unknown>;
  const inputs = context.getInputs(node.id);
  const mediaUrl = inputs['media_in'] || data.localMediaUrl;
  const provider = data.provider as string;
  const folder = data.folderPath as string;

  if (!mediaUrl) {
    throw new Error('CloudSyncNode requires media input');
  }

  // Simulate sync
  context.log('info', `Simulating sync to ${provider} at ${folder}`, { mediaUrl });
  await new Promise(resolve => setTimeout(resolve, 2000));

  const syncMessage = `Successfully synced to ${provider}`;
  context.updateNodeData(node.id, { 
    syncStatus: 'success',
    syncedPath: `${folder}/sync_${Date.now()}.png` 
  });

  return { result: syncMessage };
};
