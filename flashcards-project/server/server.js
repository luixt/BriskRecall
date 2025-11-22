// server/server.js (CommonJS version)
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const PDFParser = require("pdf2json");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());
app.use(express.json());

// 🧩 Environment variables
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

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
    // const pdfPath = req.file.path;

    // 1️⃣ Extract text from the PDF
    const pdfBuffer = req.file.buffer;
    const pdfParser = new PDFParser();

    const text = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", pdfData => {
        const rawText = pdfData.Pages.map(page => page.Texts.map(text => decodeURIComponent(text.R[0].T)).join(' ')).join(' ');
        resolve(rawText);
      });
      pdfParser.parseBuffer(pdfBuffer);
    });

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

const PORT = process.env.VITE_PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
app.get("/", (req, res) => {
  res.send("Backend API is running ✅");
});