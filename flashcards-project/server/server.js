// server.js
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());

// 🧩 Environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Middleware to verify Supabase token
async function verifyUser(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Missing Authorization header');

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return res.status(401).send('Invalid token');

  req.user = data.user;
  next();
}

// ✅ /api/upload — handles PDF upload and generates flashcards
app.post('/api/upload', verifyUser, upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body;
    const pdfPath = req.file.path;

    // 1️⃣ Extract text from the PDF
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;

    // Clean up temp file
    fs.unlinkSync(pdfPath);

    // 2️⃣ Generate flashcards using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are a study assistant. Based on the text below, create exactly 15 flashcards.
      Each flashcard must have a 'question' and an 'answer'. Return JSON in this format:
      [
        {"question": "...", "answer": "..."},
        ...
      ]

      Text:
      """${text.slice(0, 8000)}"""
    `;

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();

    // 3️⃣ Try parsing the response as JSON
    let cards;
    try {
      cards = JSON.parse(rawResponse);
    } catch {
      console.warn('Gemini returned unstructured output. Wrapping manually.');
      cards = [{ question: 'Parsing error', answer: rawResponse }];
    }

    // 4️⃣ Return deck info and cards
    res.json({ deckTitle: title, cards });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
