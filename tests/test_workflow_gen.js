import fetch from 'node-fetch';

async function test() {
  const req = await fetch('http://localhost:3001/api/ai-workflow/generate', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      // we need to bypass auth. I'll pass a fake token and run server with REQUIRE_AUTH=false
    },
    body: JSON.stringify({ prompt: 'Create a workflow that generates an image of a cat and turns it into a video' })
  });
  const res = await req.json();
  console.log(JSON.stringify(res, null, 2));
}
test();
