import React, { useState, useEffect, FC } from 'react';

interface IProps {
  text: string;
  speed?: number;
}
const Typewriter: FC<IProps> = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return <p>{displayText}</p>;
};

export default Typewriter;
