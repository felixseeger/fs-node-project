import { useCallback, useState, useEffect, useRef } from 'react';
import { Position, Handle } from '@xyflow/react';
import NodeShell from './NodeShell';
import { getHandleColor } from '../utils/handleTypes';
import { videoImproveGenerate, pollVideoImproveStatus } from '../utils/api';
import ImprovePromptButton from './ImprovePromptButton';
import NodeProgress from './NodeProgress';
import useNodeProgress from '../hooks/useNodeProgress';

const BASE_MODELS = [
    { value: 'self_forcing', label: 'Self-Forcing (Wan)' },
    { value: 'causal_forcing', label: 'Causal Forcing (Wan)' },
    { value: 'longlive', label: 'LongLive (Wan)' },
    { value: 'krea14b', label: 'Krea 14B' },
];

const REWARD_MODELS = [
    { value: 'hpsv3', label: 'HPSv3 (Aesthetics)' },
    { value: 'videoalign_vq', label: 'VideoAlign VQ (Fidelity)' },
    { value: 'videoalign_mq', label: 'VideoAlign MQ (Motion)' },
    { value: 'videoalign_ta', label: 'VideoAlign TA (Alignment)' },
    { value: 'multi_reward', label: 'Multi-Reward (All)' },
];

const NUM_FRAMES_OPTIONS = [
    { value: 81, label: 'Short (81)' },
    { value: 240, label: 'Standard (240)' },
    { value: 480, label: 'Long (480)' },
];

export default function VideoImproveNode({ id, data, selected }) {
    const { isActive, start, complete, fail, progress, status, message } = useNodeProgress();

    const localBaseModel = data.localBaseModel || 'self_forcing';
    const localRewardModel = data.localRewardModel || 'hpsv3';
    const localNumFrames = data.localNumFrames || 240;

    const update = useCallback(
        (patch) => data.onUpdate?.(id, patch),
        [id, data]
    );

    const getConnInfo = useCallback((handleId) => {
        return data.getConnectionInfo?.(id, handleId) || null;
    }, [id, data]);

    const promptConnection = getConnInfo('prompt-in');
    const hasPromptConnection = data.hasConnection?.(id, 'prompt-in');

    const handleGenerate = useCallback(async () => {
        const prompt = data.resolveInput?.(id, 'prompt-in') || data.inputPrompt || '';
        if (!prompt) return;

        start('Initializing Astrolabe framework...');
        update({ outputVideo: null, isLoading: true, outputError: null });

        try {
            const params = {
                prompt,
                base_model: localBaseModel,
                reward_model: localRewardModel,
                num_frames: localNumFrames,
            };

            const result = await videoImproveGenerate(params);

            if (result.error) {
                fail(new Error(result.error?.message || JSON.stringify(result.error)));
                update({ isLoading: false, outputError: result.error?.message || JSON.stringify(result.error) });
                return;
            }

            const taskId = result.task_id || result.data?.task_id;
            if (taskId) {
                const statusResult = await pollVideoImproveStatus(taskId);
                const generated = statusResult.data?.generated || [];
                complete('Video improvement complete');
                update({
                    outputVideo: generated[0] || null,
                    outputVideos: generated,
                    isLoading: false,
                    outputError: null,
                });
            } else if (result.data?.generated?.length) {
                complete('Video improvement complete');
                update({
                    outputVideo: result.data.generated[0],
                    outputVideos: result.data.generated,
                    isLoading: false,
                    outputError: null,
                });
            } else {
                complete('Done');
                update({ isLoading: false });
            }
        } catch (err) {
            console.error('Video improve error:', err);
            fail(err);
            update({ isLoading: false, outputError: err.message });
        }
    }, [id, data, update, localBaseModel, localRewardModel, localNumFrames, start, complete, fail]);

    const lastTrigger = useRef(null);
    useEffect(() => {
        if (data.triggerGenerate && data.triggerGenerate !== lastTrigger.current) {
            lastTrigger.current = data.triggerGenerate;
            handleGenerate();
        }
    }, [data.triggerGenerate, handleGenerate]);

    // ── Helpers ──

    const sectionHeader = (label, handleId, handleType, color, extra) => (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 6, marginTop: 10,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Handle type={handleType} position={handleType === 'target' ? Position.Left : Position.Right}
                    id={handleId} style={{
                        width: 10, height: 10, borderRadius: '50%', background: color, border: 'none',
                        position: 'relative', left: handleType === 'target' ? -12 : 'auto',
                        right: handleType === 'source' ? -12 : 'auto', transform: 'none',
                    }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>{label}</span>
            </div>
            {extra && <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{extra}</div>}
        </div>
    );

    const linkedBadges = (onUnlinkHandle) => (
        <>
            <span style={{ fontSize: 9, color: '#3b82f6', padding: '2px 6px', background: 'rgba(59,130,246,0.1)', borderRadius: 4 }}>linked</span>
            <button onClick={() => data.onUnlink?.(id, onUnlinkHandle)} style={{
                fontSize: 9, color: '#ef4444', padding: '2px 6px', background: 'rgba(239,68,68,0.15)', borderRadius: 4,
                border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
            }}>unlink</button>
        </>
    );

    const pill = (label, isActive, onClick, activeColor) => (
        <button key={label} onClick={onClick} style={{
            flex: 1, padding: '4px 0', fontSize: 11, fontWeight: isActive ? 600 : 400,
            borderRadius: 6, cursor: 'pointer',
            background: isActive ? (activeColor || '#14b8a6') : '#1a1a1a',
            color: isActive ? '#fff' : '#999',
            border: `1px solid ${isActive ? (activeColor || '#14b8a6') : '#3a3a3a'}`,
        }}>{label}</button>
    );

    const ACCENT = '#14b8a6'; // Teal for Video

    return (
        <NodeShell label={data.label || 'Astrolabe Video Improve'} dotColor={ACCENT} selected={selected} onGenerate={handleGenerate} isGenerating={isActive}>

            {/* ── Video Output Handle ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                marginBottom: 4,
            }}>
                <span style={{ fontSize: 10, color: '#999', marginRight: 4 }}>video</span>
                <Handle type="source" position={Position.Right} id="video-out" style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: getHandleColor('video-out'), border: 'none',
                    position: 'relative', right: -12, transform: 'none',
                }} />
            </div>

            {/* ── 1. Prompt (Required) ── */}
            {sectionHeader('Prompt', 'prompt-in', 'target', getHandleColor('prompt-in'),
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <ImprovePromptButton id={id} data={data} update={update} type="video" />
                    {hasPromptConnection ? linkedBadges('prompt-in') : null}
                </div>
            )}
            {hasPromptConnection ? (
                <div style={{ fontSize: 11, color: '#93b4f5', padding: '6px 10px', background: 'rgba(59,130,246,0.1)', borderRadius: 6 }}>
                    Linked from {promptConnection?.nodeLabel}
                </div>
            ) : (
                <>
                    <textarea value={data.inputPrompt || ''}
                        onChange={(e) => update({ inputPrompt: e.target.value })}
                        placeholder="e.g. A cat running | A dog sleeping[5s#]"
                        rows={3}
                        style={{
                            width: '100%', background: '#1a1a1a', border: '1px solid #3a3a3a',
                            borderRadius: 6, color: '#e0e0e0', fontSize: 12, padding: 8,
                            resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                        }} />
                    <div style={{ fontSize: 10, color: '#666', marginTop: 4, lineHeight: 1.4 }}>
                        <strong>Tip:</strong> Use <code style={{ color: '#999' }}>|</code> to split scenes. Add <code style={{ color: '#999' }}>[10s]</code> for duration, or <code style={{ color: '#999' }}>[10s#]</code> for a hard cut.
                    </div>
                </>
            )}

            {/* ── 2. Settings ── */}
            <div style={{
                background: '#1a1a1a', borderRadius: 8, border: '1px solid #3a3a3a',
                padding: 12, marginTop: 10,
            }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#e0e0e0', marginBottom: 10, textAlign: 'center' }}>
                    Alignment Settings
                </div>

                <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Base Model</div>
                    <select value={localBaseModel} onChange={(e) => update({ localBaseModel: e.target.value })}
                        style={{ width: '100%', background: '#111', border: '1px solid #3a3a3a', borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px', outline: 'none' }}>
                        {BASE_MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Reward Alignment</div>
                    <select value={localRewardModel} onChange={(e) => update({ localRewardModel: e.target.value })}
                        style={{ width: '100%', background: '#111', border: '1px solid #3a3a3a', borderRadius: 6, color: '#e0e0e0', fontSize: 11, padding: '6px 8px', outline: 'none' }}>
                        {REWARD_MODELS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>Frames / Duration</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {NUM_FRAMES_OPTIONS.map((f) => pill(f.label, localNumFrames === f.value, () => update({ localNumFrames: f.value }), ACCENT))}
                    </div>
                </div>
            </div>

            <NodeProgress progress={progress} status={status} message={message} isActive={isActive} />

            {/* ── 3. Output ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 6, marginTop: 10,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#e0e0e0' }}>Improved Video</span>
                </div>
            </div>
            <div style={{
                background: '#1a1a1a', borderRadius: 6, border: '1px solid #3a3a3a',
                minHeight: 120, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}>
                {isActive ? (
                    <span style={{ fontSize: 10, color: '#999' }}>{message || 'Aligning video...'}</span>
                ) : data.outputVideo ? (
                    <video src={data.outputVideo} autoPlay loop muted controls style={{ width: '100%', display: 'block', borderRadius: 6 }} />
                ) : data.outputError ? (
                    <span style={{ fontSize: 10, color: '#ef4444', padding: 12, textAlign: 'center', wordBreak: 'break-word' }}>{data.outputError}</span>
                ) : (
                    <span style={{ fontSize: 11, color: '#555', padding: 16, textAlign: 'center' }}>Aligned video will appear here</span>
                )}
            </div>
        </NodeShell>
    );
}