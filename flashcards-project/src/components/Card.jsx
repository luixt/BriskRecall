import { useState } from 'react'
import React from "react";
import './Card.css';

const Card = ({question, answer}) => {

    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className={`card ${isFlipped ? 'flipped-back' : ''}`} onClick={handleFlip}>
          <div className="card-front" style={{backgroundColor: "lightblue"}}>
            <h2>{question}</h2>
          </div>
          <div className="card-back" style={{backgroundColor: "lightcoral"}}>
            <h2>{answer}</h2>
          </div>
      </div>
    )

};

export default Card;