import { GoogleGenerativeAI } from '@google/generative-ai';
import formidable from 'formidable';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

// Simple rate limiting (resets on function cold start - good enough for demo)
let dailyRequestCount = 0;
let lastResetDate = new Date().toDateString();
const DAILY_LIMIT = 100; // Conservative limit for competition demo

function checkRateLimit() {
  const today = new Date().toDateString();

  // Reset counter if new day
  if (today !== lastResetDate) {
    dailyRequestCount = 0;
    lastResetDate = today;
  }

  // Check if limit exceeded
  if (dailyRequestCount >= DAILY_LIMIT) {
    return false;
  }

  dailyRequestCount++;
  return true;
}

// Configure CORS
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check rate limit
  if (!checkRateLimit()) {
    return res.status(429).json({
      score: 0,
      evaluation: 'Daily demo limit reached (100 requests/day). This is a free demo for competition judging. Please try again tomorrow or contact the team for access.',
    });
  }

  let tempAudioPath = null;

  try {
    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use Gemini 1.5 Flash (free tier - 2.0 requires paid plan)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Parse form data
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const goal = fields.goal?.[0] || 'General';
    const subType = fields.sub_type?.[0] || 'Interview';
    const userResponse = fields.text_input?.[0] || '';
    const contextText = fields.context_text?.[0] || '';

    // Handle PDF resume if provided
    let resumeContent = 'No resume provided.';
    const uploadedFile = files.file?.[0];
    if (uploadedFile) {
      try {
        const pdfBuffer = await readFile(uploadedFile.filepath);
        // Note: PDF parsing in Node.js would require additional library
        // For now, we'll note it's provided but not parse it
        resumeContent = 'Resume file provided (parsing not implemented in demo)';
        await unlink(uploadedFile.filepath);
      } catch (err) {
        console.error('PDF read error:', err);
      }
    }

    // Build prompt
    const prompt = `
You are an expert interview coach for ${goal} (${subType}).
RESUME: ${resumeContent}
CONTEXT/NOTES: ${contextText}
USER RESPONSE: "${userResponse}"

TASK:
1. Analyze the audio response based on the position requested.
2. Evaluate speech patterns: pacing, tone, filler words, stutters.
3. Assess other soft qualities: confidence, clarity, engagement, professionalism.
4. Assess other additional qualities based on the context and role provided.
5. Provide a total score (0-100) and detailed evaluation.

Return ONLY a JSON object with this structure:
{
  "score": 0-100,
  "evaluation": "string",
  "metrics": {
    "filler_word_count": "string",
    "tone_analysis": "string",
    "pacing": "string",
    "confidence": "string",
    "clarity": "string",
    "stutters": "string",
    "engagement": "string",
    "professionalism": "string",
    "additional_qualities": "string"
  }
}
`;

    const parts = [{ text: prompt }];

    // Handle audio file if provided
    const audioResponse = files.audio_response?.[0];
    if (audioResponse) {
      try {
        tempAudioPath = audioResponse.filepath;
        const audioBuffer = await readFile(tempAudioPath);
        const audioBase64 = audioBuffer.toString('base64');

        parts.push({
          inlineData: {
            mimeType: audioResponse.mimetype || 'audio/wav',
            data: audioBase64,
          },
        });
      } catch (err) {
        console.error('Audio processing error:', err);
      }
    }

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const response = result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(cleanText);

    return res.status(200).json(aiData);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      score: 0,
      evaluation: `Backend Error: ${error.message}`,
    });
  } finally {
    // Cleanup temp audio file
    if (tempAudioPath) {
      try {
        await unlink(tempAudioPath);
      } catch (err) {
        console.error('Cleanup error:', err);
      }
    }
  }
}
