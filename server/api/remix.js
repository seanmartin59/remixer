import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const anthropic = new Anthropic();

export const handler = async function(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Text is required' });
    }

    try {
      const response = await anthropic.messages.create({
        max_tokens: 1024,
        model: "claude-3-5-sonnet-20241022",
        system: "You are a creative text remixer. Your goal is to make text more engaging while keeping the core meaning.",
        messages: [{
          role: "user",
          content: `Please remix this text: ${text}`
        }]
      });

      const remixedText = response.content[0].text;
      res.status(200).json({ remixedText });
    } catch (anthropicError) {
      console.error('Anthropic API Error:', anthropicError);
      res.status(500).json({ 
        message: 'Error calling Anthropic API',
        error: anthropicError.message 
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      message: 'Error processing request',
      error: error.message 
    });
  }
}; 