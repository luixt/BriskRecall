// server/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const PDFParser = require('pdf2json');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());
app.use(express.json());

// Supabase + Gemini setup
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

// Middleware to verify Supabase token
async function verifyUser(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Missing Authorization header');

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return res.status(401).send('Invalid token');

  req.user = data.user;
  next();
}

// Safe decode helper
function safeDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str || '';
  }
}

// /api/upload — handles PDF upload and flashcard generation
app.post('/api/upload', verifyUser, upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file) return res.status(400).send('No file uploaded');

    const pdfBuffer = req.file.buffer;

    // Parse PDF using pdf2json
    const pdfParser = new PDFParser();
    const pdfText = await new Promise((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
      pdfParser.on('pdfParser_dataReady', pdfData => {
        try {
          const text = pdfData.Pages
            .map(page => page.Texts.map(t => safeDecode(t.R[0].T)).join(' '))
            .join(' ');
          resolve(text);
        } catch (err) {
          reject(err);
        }
      });
      pdfParser.parseBuffer(pdfBuffer);
    });

    // 2️⃣ Generate flashcards using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
    You are a flashcard generator. Return ONLY valid JSON. 
    No explanations. No markdown. No code fences.

    Generate EXACTLY 15 flashcards from the text below.

    Format:
    [
      {"question": "Q1", "answer": "A1"},
      {"question": "Q2", "answer": "A2"},
      ...
    ]

    Text:
    """${pdfText.slice(0, 8000)}"""
    `;

    const result = await model.generateContent(prompt);
    let rawResponse = result.response.text();

    // 🧹 Clean LLM output
    let cleaned = rawResponse
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const first = cleaned.indexOf('[');
    const last = cleaned.lastIndexOf(']');

    cleaned = cleaned.slice(first, last + 1);

    // 🧪 Parse JSON safely
    let cards;
    try {
      cards = JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini output parsing failed:", rawResponse);
      cards = [{ question: "Parsing failed", answer: rawResponse }];
    }

    res.json({ deckTitle: title, cards });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + err.message);
  }
});

// Server start
const PORT = process.env.VITE_PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
app.get("/", (req, res) => res.send("Backend API is running ✅"));
