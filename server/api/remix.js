import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env') });

const anthropic = new Anthropic();

const tweetSystemPrompt =`
You are a social media expert and ghost writer. You work for a popular blogger.

Your job is to take their blog post and come up with a variety of tweets that will capture attention and generate interest and engagement.

Since you are a ghost writer, you need to make sure to follow the style, tone, and voice of the blog post.

Remember: Tweets cannot be longer than 280 characters.

Please return the tweets in a list format, with each tweet being a separate item in the list.

Be sure to include at least 5 tweets.

Do not include any hashtags or emojis.
`

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
        system: tweetSystemPrompt,
        messages: [{
          role: "user",
          content: `Here is the blog post: ${text}`
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