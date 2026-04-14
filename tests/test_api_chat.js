import fetch from 'node-fetch';

async function test() {
  const req = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Create a video and an image and connect them to a layer node' })
  });
  const res = await req.json();
  console.log(JSON.stringify(res, null, 2));
}
test();
