import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './UploadForm.css';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return alert('Please select a PDF file first.');
    if (!title.trim()) return alert('Please enter a deck title.');

    setLoading(true);
    try {
      // 1️⃣ Get current user session for auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in.');
        return;
      }

      // 2️⃣ Create FormData to send to backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      // 3️⃣ Send PDF to your backend endpoint
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());
      const payload = await res.json();

      const { deckTitle, cards } = payload;
      const userId = session.user.id;

      // 4️⃣ Create deck in Supabase
      const { data: deck, error: deckErr } = await supabase
        .from('decks')
        .insert([{ user_id: userId, title: deckTitle || title }])
        .select()
        .single();

      if (deckErr) throw deckErr;

      // 5️⃣ Insert flashcards
      const deckId = deck.id;
      const flashcards = cards.map(c => ({
        deck_id: deckId,
        question_text: c.question,
        answer_text: c.answer,
      }));

      const { error: cardsErr } = await supabase
        .from('flashcards')
        .insert(flashcards);

      if (cardsErr) throw cardsErr;

      alert('Deck and flashcards successfully generated!');
      setFile(null);
      setTitle('');
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <label>
        Deck title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Spanish - Chapter 1"
        />
      </label>

      <label>
        PDF file:
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Upload & Generate 15 Q/A'}
      </button>
    </form>
  );
}
