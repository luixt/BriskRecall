import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';

const DeckView = () => {
  const { id } = useParams();
  const [cards, setCards] = useState([]);
  const [shuffled, setShuffled] = useState([]);

  useEffect(() => {
    if (!id) {
      console.log(`deckId: ${id} is invalid`);
      return;
    };
    const fetchCards = async () => {
      const { data, error } = await supabase.from('flashcards').select('*').eq('deck_id', id);
      console.log("Fetched cards:", data, error);
      if (!error && data) {
        setCards(data);
        setShuffled([...data].sort(() => Math.random() - 0.5));
      }
    };
    fetchCards();
  }, [id]);

  return (
    <div className="deck-view">
      <h1>Flashcards</h1>
      <button onClick={() => setShuffled([...cards].sort(() => Math.random() - 0.5))}>Shuffle</button>
      <div className="cards-grid">
        {shuffled.map((card, i) => (
          <Card key={i} question={card.question_text} answer={card.answer_text} color={'#FFD700'} />
        ))}
      </div>
    </div>
  );
};

export default DeckView;
