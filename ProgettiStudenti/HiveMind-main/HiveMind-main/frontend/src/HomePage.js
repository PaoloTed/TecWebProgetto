import './App.css';
import Card from './Card.js';
import cardsData from './data/ideas.json'; // Importa il file JSON
import useFetch from './api/useFetch.js';


function HomePage() 
{
  const {data : cards, isPending, Error} = useFetch("URL");

  return (
      <div className="bodyHomePage">
          <div className="cards">
            {cards && <Card cards = {cards} />}
          </div>
      </div>
  );
}

export default HomePage;
