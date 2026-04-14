import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
async function test() {
  try {
    const res = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 10,
      messages: [{role: 'user', content: 'hi'}]
    });
    console.log(res.content);
  } catch (e) {
    console.error(e.message);
  }
}
test();
