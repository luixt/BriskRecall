import { useState } from 'react';
import React from 'react';

const Card = ({ question, answer, color }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className={`card ${isFlipped ? 'flipped-back' : ''}`} onClick={handleFlip}>
      <div className="card-front" style={{ backgroundColor: color }}>
        <h1>{question}</h1>
      </div>
      <div className="card-back" style={{ backgroundColor: color }}>
        <h2>{answer}</h2>
      </div>
    </div>
  );
};

export default Card;
