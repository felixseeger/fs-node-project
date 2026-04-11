import bflLogo from '../assets/icons/black-forest-labs.svg';
import bytedanceLogo from '../assets/icons/bytedance-logo.svg';
import googleLogo from '../assets/icons/google.svg';
import pixverseLogo from '../assets/icons/pixverse.svg';
import runwayLogo from '../assets/icons/runway.svg';
import minimaxLogo from '../assets/icons/minimax.svg';
import ltxLogo from '../assets/icons/ltx-logo-light.svg';
import klingLogo from '../assets/icons/kling.svg';
import recraftLogo from '../assets/icons/recraft_logo.png';
import koraLogo from '../assets/icons/kora.png';
import qwenLogo from '../assets/icons/qwen.png';
import wanLogo from '../assets/icons/wan2-6.png';

/**
 * Logo URL for universal generator model keys / inspector option ids
 * (e.g. "Nano Banana 2", "kling3", "flux-expand"). Returns null for Auto / unknown.
 */
export function getUniversalModelLogo(modelId: string): string | null {
  if (!modelId || modelId === 'Auto') return null;
  const lower = modelId.toLowerCase();

  if (lower.includes('nano banana') || lower.includes('veo') || lower.includes('gemini')) return googleLogo;
  if (lower.includes('google') && !lower.includes('wan')) return googleLogo;

  if (lower.includes('recraft')) return recraftLogo;
  if (lower.includes('kora')) return koraLogo;
  if (lower.includes('qwen')) return qwenLogo;

  if (lower.includes('flux')) return bflLogo;

  if (lower.includes('seedream') || lower.includes('seedance')) return bytedanceLogo;

  if (lower.includes('kling')) return klingLogo;
  if (lower.includes('runway')) return runwayLogo;
  if (lower.includes('minimax')) return minimaxLogo;
  if (lower.includes('pixverse')) return pixverseLogo;
  if (lower.includes('wan')) return wanLogo;
  if (lower.includes('ltx')) return ltxLogo;

  return null;
}
