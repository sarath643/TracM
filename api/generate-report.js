import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { data } = req.body;
      const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const prompt = `As a financial advisor, analyze this financial data and provide a personalized summary, identifying areas where expenses can be managed better. The amounts are shown in Indian Rupees. Offer specific recommendations to improve financial behavior and savings. Here is the data: ${JSON.stringify(
        data
      )}.
            Format your response as follows:
            Summary: [Your summary here]
        
            Recommendations:
            1. [First recommendation]
            2. [Second recommendation]
            3. [Third recommendation]`;
      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      // Parse the response
      const [summary, recommendationsText] = text.split('Recommendations:');
      const recommendations = recommendationsText
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, '').trim());

      res.status(200).json({
        summary: summary.replace('Summary:', '').trim(),
        recommendations,
      });

      res.status(200).json({ message: response });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate report' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
