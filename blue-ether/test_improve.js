async function test() {
  const res = await fetch('http://localhost:3001/api/improve-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: "A picture of myself", type: "image", language: "en" })
  });
  const data = await res.json();
  console.log(data);
}
test();
