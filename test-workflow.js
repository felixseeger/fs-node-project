async function test() {
  try {
    const res = await fetch('http://localhost:3001/api/ai-workflow/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'color correction workflow', mode: 'standard' }),
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.error(e);
  }
}
test();
