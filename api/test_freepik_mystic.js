import 'dotenv/config';

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;

async function testModel(model) {
  console.log(`Testing model: ${model}...`);
  const body = {
    prompt: 'a futuristic city',
    model: model,
    aspect_ratio: 'square_1_1',
    num_images: 1
  };

  try {
    const response = await fetch('https://api.freepik.com/v1/ai/mystic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': FREEPIK_API_KEY
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log(`[${model}] Status:`, response.status);
    if (!response.ok) {
       console.log(`[${model}] Error:`, data.message);
       if (data.invalid_params) {
         console.log(`[${model}] Invalid Params:`, JSON.stringify(data.invalid_params));
       }
    } else {
       console.log(`[${model}] Success! Task ID:`, data.data?.task_id);
    }
  } catch (error) {
    console.error(`[${model}] Request failed:`, error.message);
  }
}

async function runTests() {
  const models = ['automatic', 'fluid', 'realism', 'flux', 'zen', 'flexible', 'super_real'];
  for (const model of models) {
    await testModel(model);
    console.log('---');
  }
}

runTests();
