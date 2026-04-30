import React, { useState, useEffect } from 'react';
import Card from './Card.js';
import './IdeaPages.css';
import { useAuth } from '../../utils/AuthContex.js';
import useFetch from './useFetch.js';

const IdeasPage = ({ sortBy }) => {
  const { data: ideas, loading, error, loadingAction, updateData } = useFetch('http://localhost:5000/idee');
  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 10;
  const { username } = useAuth();
  
  const [likedIdeas, setLikedIdeas] = useState([]);
  const [dislikedIdeas, setDislikedIdeas] = useState([]);
  const [actionError, setActionError] = useState({ id: null, message: '' });

  const updateIdeaLikesDislikes = (updatedIdea) => {
    setLikedIdeas((prevLikes) =>
      prevLikes.map((idea) =>
        idea.id === updatedIdea.id ? { ...idea, like: updatedIdea.like.length } : idea
      )
    );
    setDislikedIdeas((prevDislikes) =>
      prevDislikes.map((idea) =>
        idea.id === updatedIdea.id ? { ...idea, dislike: updatedIdea.dislike.length } : idea
      )
    );
  };

  const handleLike = async (id) => {
    if (!username) {
      setActionError({ id, message: 'Devi essere loggato per mettere like.' });
      return;
    }
    const { updatedItem, error } = await updateData(`http://localhost:5000/idee/${id}/like/${username}`);
    if (error) {
      setActionError({ id, message: error.response?.data?.error || 'Errore durante il like' });
    } else {
      if (updatedItem) {
        updateIdeaLikesDislikes(updatedItem);
      }
      setActionError({ id: null, message: '' });
    }
  };

  const handleDislike = async (id) => {
    if (!username) {
      setActionError({ id, message: 'Devi essere loggato per mettere dislike.' });
      return;
    }
    const { updatedItem, error } = await updateData(`http://localhost:5000/idee/${id}/dislike/${username}`);
    if (error) {
      setActionError({ id, message: error.response?.data?.error || 'Errore durante il dislike' });
    } else {
      if (updatedItem) {
        updateIdeaLikesDislikes(updatedItem);
      }
      setActionError({ id: null, message: '' });
    }
  };

  useEffect(() => {
    if (ideas.length > 0) {
      setLikedIdeas(ideas.map((idea) => ({ id: idea.id, like: idea.like.length })));
      setDislikedIdeas(ideas.map((idea) => ({ id: idea.id, dislike: idea.dislike.length })));
    }
  }, [ideas]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const sortedIdeas = [...ideas].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.like.length - a.like.length;
    } else if (sortBy === 'dislikes') {
      return b.dislike.length - a.dislike.length;
    } else if (sortBy === 'balance') {
      const balanceA = Math.abs(a.like.length - a.dislike.length);
      const balanceB = Math.abs(b.like.length - b.dislike.length);

      if (balanceA === balanceB) {
        const totalVotesA = a.like.length + a.dislike.length;
        const totalVotesB = b.like.length + b.dislike.length;
        return totalVotesB - totalVotesA; // Prioritize the idea with more total votes
      }
      return Math.abs(balanceA) - Math.abs(balanceB); // Prioritize ideas with a balance close to zero
    } else if (sortBy === 'unpopular') {
      const balanceA = a.like.length - a.dislike.length;
      const balanceB = b.like.length - b.dislike.length;
      return balanceA - balanceB; // Prioritize ideas with the lowest balance
    } else if (sortBy === 'mainstream') {
      const balanceA = a.like.length - a.dislike.length;
      const balanceB = b.like.length - b.dislike.length;
      return balanceB - balanceA; // Prioritize ideas with the highest balance
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedIdeas.length / ideasPerPage);
  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = sortedIdeas.slice(indexOfFirstIdea, indexOfLastIdea);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="ideas-page">
      <div className="ideas-list">
        {currentIdeas.map((idea) => {
          const likedByUser = idea.like.includes(username);
          const dislikedByUser = idea.dislike.includes(username);
          return (
            <Card
              key={idea.id}
              id={idea.id}
              autore={idea.Utente.username}
              titolo={idea.titolo}
              descrizione={idea.descrizione}
              likes={likedIdeas.find((item) => item.id === idea.id)?.like || idea.like.length}
              dislikes={dislikedIdeas.find((item) => item.id === idea.id)?.dislike || idea.dislike.length}
              onLike={() => handleLike(idea.id)}
              onDislike={() => handleDislike(idea.id)}
              loadingAction={loading}
              ideaId={idea.id}
              comments={idea.comments}
              errorMessage={actionError.id === idea.id ? actionError.message : ''}
              likedByUser={likedByUser}
              dislikedByUser={dislikedByUser}
            />
          );
        })}
      </div>

      <nav aria-label="Page navigation example" className="pagination">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <button
              onClick={prevPage}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1}>
              <button
                onClick={() => paginate(index + 1)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${
                  index + 1 === currentPage
                    ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
                aria-current={index + 1 === currentPage ? 'page' : undefined}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={nextPage}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default IdeasPage;
