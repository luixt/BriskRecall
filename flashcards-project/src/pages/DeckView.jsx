import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { supabase } from '../supabaseClient';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './DeckView.css';

const DeckView = () => {

  const { id } = useParams();
  const nav = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const {state} = useLocation();
  const deckTitle = state?.name || 'Deck';

  useEffect(() => {
    if (!id) {
      console.log(`deckId: ${id} is invalid`);
      return;
    };
    const fetchCards = async () => {
      const { data, error } = await supabase.from('flashcards').select('*').eq('deck_id', id);
      console.log("Fetched cards:", data, error);
      if (!error && data) {
        setShuffledCards([...data].sort(() => Math.random() - 0.5));
        console.log("Shuffled cards set:", shuffledCards);
      }
    };
    fetchCards();
  }, [id]);


  const getCurrentCard = () => {
    if (shuffledCards.length === 0) return null; 
    return shuffledCards[currentCardIndex];
  };

  const shuffleArray = (array) => {
    return array.slice().sort(() => Math.random() - 0.5);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % shuffledCards.length);
    setUserInput('');
    setFeedback('');
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex((prevIndex) => 
      (prevIndex === 0 ? shuffledCards.length - 1 : prevIndex - 1)
    );
    setUserInput('');
    setFeedback('');
  };

  const handleShuffleCard = () => {
    const shuffledArray = shuffleArray(shuffledCards);
    setShuffledCards(shuffledArray);
    setCurrentCardIndex(0);
    setUserInput('');
    setFeedback('');
  };

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const onCheckAnswer = () => {
    const card = getCurrentCard();
    if (!card) return;
    
    const correctAnswer = card.answer_text.toLowerCase();

    if (userInput.trim().toLowerCase() === correctAnswer) {
      setFeedback('Correct! 🎉');
      setCurrentStreak((prev) => {
        const newStreak = prev + 1;
        setLongestStreak((prevLongest) => Math.max(prevLongest, newStreak));
        return newStreak;
      });
    } else if (userInput.trim() === '') {
      setFeedback('Please enter your guess before submitting!');
    } else {
      setFeedback('Incorrect! Try Again!');
      setCurrentStreak(0);
    }
  };

  const card = getCurrentCard();
  if (!card) return <div>Loading...</div>;

  return (
    <div className="set">
      <div className="deck-header">
      <button
        className="back-btn"
        onClick={() => nav('/decks')}
      >
        ⟵
      </button>
      </div>
      <div className="title">
        <h1>"{deckTitle}" Flashcards</h1>
        <h3>Learn the common concepts involved in the submitted PDF file!</h3>
        <h4>Number of flash cards: {shuffledCards.length}</h4>
        <div className='streaks'>
          <h4>Current Streak: {currentStreak}</h4>
          <h4>Longest Streak: {longestStreak}</h4>
        </div>
      </div>
      <br></br>
      <Card 
      question={card.question_text} 
      answer={card.answer_text}
      />
      <br></br>
      <p>{currentCardIndex + 1} of {shuffledCards.length}</p>
      <div className="buttons">
        <button onClick={handlePreviousCard} type="prev">⭠</button>
        <button onClick={handleNextCard} type="next">⭢</button>
      </div>

      <div className="input-section">
        <input
          type="text"
          value={userInput}
          placeholder="Enter your guess..."
          onChange={handleChange}
          className="textbox"
        />
        <button onClick={onCheckAnswer} className="submit-button">Submit</button>
      </div>

      <div className="feedback">
        {feedback}
      </div>

      <button id="shuffle-button" onClick={handleShuffleCard} type="shuffle">🔀 Shuffle</button>
      
    </div>
  );
};

export default DeckView;
