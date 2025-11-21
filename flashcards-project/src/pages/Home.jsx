// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">

      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">
          Transform Your Study Materials Into Smart Flashcards
        </h1>

        <p className="hero-subtitle">
          Upload a PDF. Let AI extract the key concepts, generate questions and answers, 
          and instantly create a deck of 15 high-quality flashcards — ready to study smarter.
        </p>

        <Link to="/decks" className="hero-btn">
          Start Creating Decks →
        </Link>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="feature-card">
          <h3>📘 Automated Flashcards</h3>
          <p>
            AI reads your uploaded content and generates accurate questions & answers automatically, saving you hours of manual work.
          </p>
        </div>

        <div className="feature-card">
          <h3>⚡Faster Learning</h3>
          <p>
            Review your decks with flipping animations, shuffle mode, and clean visuals to improve recall and retention.
          </p>
        </div>

        <div className="feature-card">
          <h3>🧠 Advanced AI</h3>
          <p>
            Your PDFs are chunked and indexed using Pinecone, then processed with Google Gemini to extract the most relevant concepts.
          </p>
        </div>

        <div className="feature-card">
          <h3>🔎 Focused Study</h3>
          <p>
            Flashcards are structured and concise, highlighting only the key points you need to memorize, reducing information overload.
          </p>
        </div>

        <div className="feature-card">
          <h3>📈 Track Your Progress</h3>
          <p>
            Save and revisit decks anytime. Keep track of your study sessions and reinforce learning over time.
          </p>
        </div>

        <div className="feature-card">
          <h3>🌐 Multi-Deck Support</h3>
          <p>
            Create multiple decks for different subjects or topics. Switch between them easily for organized learning.
          </p>
        </div>
      </div>

    </div>
  );
}
