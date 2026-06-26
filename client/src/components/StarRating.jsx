import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, interactive = false, onChange, size = 18 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const activeValue = hoverRating || rating;
    const isFilled = i <= activeValue;

    stars.push(
      <Star
        key={i}
        size={size}
        className={`star-icon ${isFilled ? 'star-filled' : ''} ${interactive ? 'star-interactive' : ''}`}
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
      />
    );
  }

  return <div className="stars-container">{stars}</div>;
}
