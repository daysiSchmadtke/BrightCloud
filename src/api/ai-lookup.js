import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ error: 'A valid question is required.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(question);
    const { response } = result;
    const text = response.text();

    return res.status(200).json({ answer: text });
  } catch (error) {
    console.error('AI Lookup API Error:', error);
    return res.status(500).json({ error: 'Failed to get an AI response. Please try again.', details: error.message });
  }
}
