import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { supabase } from '../supabaseClient';

const DeckView = ({ deckId }) => {
  const [cards, setCards] = useState([]);
  const [shuffled, setShuffled] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const { data, error } = await supabase.from('flashcards').select('*').eq('deck_id', deckId);
      if (!error && data) {
        setCards(data);
        setShuffled([...data].sort(() => Math.random() - 0.5));
      }
    };
    fetchCards();
  }, [deckId]);

  return (
    <div className="deck-view">
      <h1>Flashcards</h1>
      <button onClick={() => setShuffled([...cards].sort(() => Math.random() - 0.5))}>Shuffle</button>
      <div className="cards-grid">
        {shuffled.map((card, i) => (
          <Card key={i} question={card.question} answer={card.answer} color={'#FFD700'} />
        ))}
      </div>
    </div>
  );
};

export default DeckView;
