write all these in markdown:

# BriskRecall: Interactive Flashcard Learning Platform

## 🚀 Purpose & Mission
**BriskRecall** is a full-stack web application designed to **streamline learning and retention**. Users can upload PDFs, automatically generate flashcards via AI, and practice with an interactive interface that includes shuffling, flipping, and streak tracking.

**Mission:**  
Empower learners to efficiently retain knowledge by combining AI-powered content generation with active recall study techniques.

## 🧑‍💻 Team
- **Luis Delgado** – Product Owner, Team Lead Developer
- **Ana Oliveira** – Frontend/Backend Developer
- **Gaeldesh Demosthene** – Frontend/Backend Developer
- **Andres Hernandez** – Scrum Master, Frontend/Backend Developer

## ⚙️ Architecture
- **Frontend:** React, HTML, CSS, Vite  
- **Backend:** Node.js, Express.js, Multer (file upload), Supabase (Auth + Database)  
- **AI Integration:** Google Gemini AI for automatic flashcard generation  
- **Database:** Supabase PostgreSQL with tables: `users`, `decks`, `flashcards` (supports cascading deletes)  
- **State Management:** React `useState` + `useEffect` hooks  
- **Additional Features:** Card flipping animation, shuffle/review functionality, streak tracking  

## 📂 Folder Structure
flashcards-project/
├── server/ # Node.js backend
│ ├── server.js
│ ├── package.json
│ └── .env # backend env variables
├── src/ # React frontend
│ ├── components/
│ ├── pages/
│ └── App.jsx
└── README.md


## ⚡ Features
- Upload PDFs and auto-generate 15 flashcards per document
- Flip cards horizontally to view question/answer
- Shuffle cards and navigate circularly through decks
- Track current and longest streaks
- Secure authentication and user-specific decks

## 📝 Setup & Test (Summary)
1. **Install Node.js & npm** (v18+) if not already installed  
2. **Clone the repo:**  
'''
   git clone <repo-url>
   cd flashcards-project
'''
3. **Install dependencies for frontend & backend:**

'''
cd server
npm install
cd ../
npm install
'''
4. **Create .env files:**

- server/.env – backend keys (Supabase URL, Supabase Key, Gemini API Key)
- flashcards-project/.env – frontend keys if needed

(See Detailed Setup Guide for exact variable names)

**Run the backend:**

'''
cd server
node server.js
'''
**Run the frontend:**

'''
npm run dev
Open http://localhost:5173 (or the port your frontend runs on) in your browser
'''

**Sign up, upload PDFs, and test flashcard generation**

## 🔮 Future Improvements
- Add user progress analytics with charts and statistics

- Enable deck sharing and collaborative learning

- Optimize AI prompt and parsing to improve flashcard accuracy
- Add mobile-friendly responsive UI

- Enhance error handling and offline support

## 📖 Additional Documentation
For a more detailed, step-by-step guide to setup, API keys, database tables, and testing, see:
[Detailed Setup & Testing Guide](https://docs.google.com/document/d/1o1JiP7Tbny8VjnjDpjBAiZvr6dodiW2C_cr90hfUXH8/edit?usp=sharing)