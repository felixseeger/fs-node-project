/**
 * Prefetching utilities for Phase 7.2.1
 * Call these functions to eagerly load chunks for nodes the user is likely to use soon.
 */

export const prefetchCommonNodes = () => {
  // Prefetch basic structure nodes
  import('./InputNode').catch(console.warn);
  import('./TextNode').catch(console.warn);
  import('./ImageNode').catch(console.warn);
  import('./GeneratorNode').catch(console.warn);
  import('./ResponseNode').catch(console.warn);
  import('./WorkflowNode').catch(console.warn);
};

export const prefetchVideoNodes = () => {
  import('./VideoUniversalGeneratorNode').catch(console.warn);
  import('./LtxVideoNode').catch(console.warn);
};

export const prefetchAudioNodes = () => {
  import('./AudioUniversalGeneratorNode').catch(console.warn);
  import('./VoiceoverNode').catch(console.warn);
};
