import fs from 'fs';

let content = fs.readFileSync('frontend/src/components/LayerItem.tsx', 'utf8');

content = content.replace(/const \{ status, progress, resultUrl, error, execute \} = useAsyncPolling\(\n    '\/api\/vfx\/ltx\/generate',\n    '\/api\/vfx\/ltx\/poll\/:id'\n  \);\n\n  useEffect\(\(\) => \{\n    if \(status !== 'idle'\) \{\n      onUpdate\(layer\.id, \{\n        status,\n        progress,\n        \.\.\.\(resultUrl \? \{ src: resultUrl \} : \{\}\),\n        error: error \|\| undefined,\n      \}\);\n    \}\n  \}, \[status, progress, resultUrl, error, layer\.id, onUpdate\]\);\n\n  const handleGenerate = \(\) => \{\n    if \(!prompt\.trim\(\)\) return;\n    execute\(\{ prompt \}\);\n  \};/, 
`  const [status, setStatus] = useState<string>(layer.status || 'idle');
  const [progress, setProgress] = useState<number>(layer.progress || 0);
  const [error, setError] = useState<string | undefined>(layer.error || undefined);

  useEffect(() => {
    setStatus(layer.status || 'idle');
    setProgress(layer.progress || 0);
    setError(layer.error || undefined);
  }, [layer.status, layer.progress, layer.error]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStatus('loading');
    setProgress(0);
    setError(undefined);
    onUpdate(layer.id, { status: 'loading', progress: 0, error: undefined });

    try {
      const isImage = layer.jobType === 'image' || layer.type === 'image' || layer.jobType === 'freepik-image';
      const isAudio = layer.jobType === 'audio' || layer.type === 'audio' || layer.jobType === 'music';
      const isVideo = layer.jobType === 'video' || layer.jobType === 'ltx' || layer.type === 'video';

      let submitUrl = '/api/vfx/ltx/generate';
      if (isImage) submitUrl = '/api/generate-image';
      else if (isAudio) submitUrl = '/api/music-generation';

      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isImage ? { prompt, num_images: 1, aspect_ratio: '16:9' } : { prompt })
      });

      if (!response.ok) throw new Error(\`Submit failed: \${response.statusText}\`);

      const data = await response.json();
      
      const jobId = data.jobId || data.id || data.task_id;
      
      if (!jobId) {
        if (data.data && data.data[0] && data.data[0].url) {
          setStatus('completed');
          setProgress(100);
          onUpdate(layer.id, { status: 'completed', progress: 100, src: data.data[0].url });
          return;
        }
        throw new Error('No task ID returned');
      }

      let pollUrlTemplate = \`/api/vfx/job/:id/status\`;
      if (isImage) pollUrlTemplate = \`/api/status/:id\`;
      else if (isAudio) pollUrlTemplate = \`/api/music-generation/:id\`;

      const pollUrl = pollUrlTemplate.replace(':id', jobId);

      const pollInterval = window.setInterval(async () => {
        try {
          const pollRes = await fetch(pollUrl);
          if (!pollRes.ok) throw new Error(\`Poll failed: \${pollRes.statusText}\`);
          
          const pollData = await pollRes.json();
          
          let pStatus = pollData.status;
          let pProgress = pollData.progress;
          let pUrl = pollData.resultUrl || pollData.url || pollData.audio?.url || (pollData.generated && pollData.generated[0]) || (pollData.assets && pollData.assets.image);
          
          if (pProgress !== undefined) {
             setProgress(pProgress);
             onUpdate(layer.id, { progress: pProgress });
          } else {
             setProgress(50);
             onUpdate(layer.id, { progress: 50 });
          }
          
          if (pStatus === 'completed' || pStatus === 'COMPLETED') {
            window.clearInterval(pollInterval);
            setStatus('completed');
            setProgress(100);
            onUpdate(layer.id, { status: 'completed', progress: 100, src: pUrl });
          } else if (pStatus === 'failed' || pStatus === 'FAILED') {
            window.clearInterval(pollInterval);
            setStatus('failed');
            setError(pollData.error || 'Job failed');
            onUpdate(layer.id, { status: 'failed', error: pollData.error || 'Job failed' });
          }
        } catch (err) {
          window.clearInterval(pollInterval);
          setStatus('failed');
          setError(err.message);
          onUpdate(layer.id, { status: 'failed', error: err.message });
        }
      }, 3000);

    } catch (err) {
      setStatus('failed');
      setError(err.message);
      onUpdate(layer.id, { status: 'failed', error: err.message });
    }
  };`);

content = content.replace("layer.jobType === 'ltx'", "(layer.jobType === 'ltx' || layer.jobType === 'video' || layer.type === 'video' || layer.jobType === 'image' || layer.type === 'image' || layer.jobType === 'audio' || layer.type === 'audio')");
content = content.replace("'Enter prompt for LTX video...'", "'Enter prompt...'");
content = content.replace("? 'Generating...' : 'Generate Video'", "? 'Generating...' : layer.type === 'image' ? 'Generate Image' : layer.type === 'audio' ? 'Generate Audio' : 'Generate Video'");

content = content.replace("import { useAsyncPolling } from '../hooks/useAsyncPolling';\n", "");

fs.writeFileSync('frontend/src/components/LayerItem.tsx', content);
console.log("Patched LayerItem.tsx");
