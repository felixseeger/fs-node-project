import { readFileSync } from 'fs';

async function test() {
  const b64 = readFileSync('public/clothing.jpg', 'base64');
  console.log("Submitting style transfer...");
  const res = await fetch('http://localhost:3001/api/style-transfer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: b64,
      reference_image: b64,
      prompt: "make it look like a cartoon"
    })
  });
  const data = await res.json();
  console.log('Task submitted:', data);

  let status = data.task_status;
  const taskId = data.task_id;
  while (status !== 'COMPLETED' && status !== 'FAILED' && status !== 'COMPLETED' && status !== 'SUCCESS') {
    await new Promise(r => setTimeout(r, 2000));
    const res2 = await fetch(`http://localhost:3001/api/style-transfer/${taskId}`);
    const data2 = await res2.json();
    console.log('Status poll:', data2.task_status || data2.status, data2);
    status = data2.task_status || data2.status;
  }
}

test().catch(console.error);
