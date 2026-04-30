import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card/Card.js'; // Assicurati di avere il percorso corretto

const IdeasPage = () => {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/idee');
        setIdeas(response.data);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div>
      {ideas.map((idea, index) => (
        <Card
          key={index}
          autore={idea.Utente.username} // Commentato temporaneamente
          titolo={idea.titolo}
          descrizione={idea.descrizione}
        />
      ))}
    </div>
  );
};

export default IdeasPage;
