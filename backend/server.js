import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.post('/generate-report', async (req, res) => {
  try {
    const { data } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const [summary, recommendationsText] = text.split('Recommendations:');
    const recommendations = recommendationsText
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, '').trim());

    res.json({
      summary: summary.replace('Summary:', '').trim(),
      recommendations,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
