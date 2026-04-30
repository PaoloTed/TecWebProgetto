import React, { useState, useEffect } from 'react';
import Comment from './Comment.js';
import { useAuth } from '../../utils/AuthContex.js';

const Card = ({ id, autore, titolo, descrizione, likes, dislikes, onLike, onDislike, loadingAction, ideaId, errorMessage, comments, likedByUser, dislikedByUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const { username, isLoggedIn } = useAuth();

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetch(`http://localhost:5000/commenti/idea/${ideaId}`);
      const data = await response.json();
      setCommentsList(data);
    } catch (error) {
      console.error('Errore durante il fetch dei commenti:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, ideaId]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) {
      setCommentError('Non puoi inviare un commento vuoto, scrivi qualcosa!');
      return;
    }

    setCommentError(''); // Resetta l'errore se il commento non è vuoto

    setPostingComment(true);
    try {
      const response = await fetch('http://localhost:5000/registerCommento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data_pubblicazione: new Date(),
          contenuto: newComment,
          username: username,
          titolo: titolo,
          IdeaId: ideaId,
        }),
      });
      const responseClone = response.clone();
      if (!response.ok) {
        const errorData = await responseClone.json();
        throw new Error(errorData.message || 'Errore durante l\'invio del commento.');
      }

      const newCommentData = await response.json();
      setCommentsList([...commentsList, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Errore durante il post del commento:', error);
      alert('Si è verificato un errore durante l\'invio del commento. Riprova più tardi.');
    } finally {
      setPostingComment(false);
    }
  };

  const handleChangeNewComment = (event) => {
    setNewComment(event.target.value);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800 max-w-3xl mx-auto mb-10">
      <div className="flex flex-col p-4">
        <div className="flex items-center mb-4">
          <img
            className="h-10 w-10 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Author"
          />
          <h5 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">{autore}</h5>
        </div>

        <h5 className="text-2xl font-bold text-gray-900 dark:text-white">{titolo}</h5>
        <p className="mt-2 text-gray-700 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: descrizione }} />

        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-4">
            <button onClick={onLike} className="flex-shrink-0" aria-label="Like Post" disabled={loadingAction}>
              {loadingAction ? (
                <div className="w-14 h-14 flex items-center justify-center">
                  <div className="loader"></div>
                </div>
              ) : (
                <img
                  className={`w-14 h-14 object-cover ${likedByUser ? 'opacity-100' : 'opacity-50'}`}
                  src="https://i.ibb.co/qFprP9T/like.png"
                  alt="Like Post"
                />
              )}
            </button>
            <button onClick={onDislike} className="flex-shrink-0" aria-label="Dislike Post" disabled={loadingAction}>
              {loadingAction ? (
                <div className="w-14 h-14 flex items-center justify-center">
                  <div className="loader"></div>
                </div>
              ) : (
                <img
                  className={`w-14 h-14 object-cover ${dislikedByUser ? 'opacity-100' : 'opacity-50'}`}
                  src="https://i.ibb.co/wgnW9sG/dislike.png"
                  alt="Dislike Post"
                />
              )}
            </button>
          </div>

          <button
            className="text-white bg-gray-700 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-base px-4 py-2 text-center inline-flex items-center dark:focus:ring-gray-600"
            onClick={toggleComments}
          >
            <img src="https://i.ibb.co/5hrqYsB/comment.png" alt="Icona" className="w-8 h-8 mr-2" />
            <span className="ml-2">Commenti</span>
          </button>
        </div>

        <div className="flex mt-2 space-x-4">
          <span className="text-gray-900 dark:text-white">Likes: {likes}</span>
          <span className="text-gray-900 dark:text-white">Dislikes: {dislikes}</span>
        </div>
      </div>
      {errorMessage && (
        <div className="flex items-center p-4 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-gray-800 dark:text-red-400 mt-auto">
          <svg className="w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="font-medium p-1">Errore: </span> {errorMessage}
        </div>
      )}

      {showComments && (
        <div className="flex flex-col p-4 border-t border-gray-200 dark:border-gray-700">
          {isLoggedIn && (
            <form onSubmit={handleSubmitComment} className="mb-4">
              {commentError && (
                <div className="mb-4 text-red-600 dark:text-red-400">
                  {commentError}
                </div>
              )}
              <textarea
                value={newComment}
                onChange={handleChangeNewComment}
                className="block w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:text-white"
                placeholder="Aggiungi un commento..."
                rows={3}
              />
              <button
                type="submit"
                disabled={postingComment}
                className="mt-2 inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 transition"
              >
                {postingComment ? 'Invio...' : 'Invia'}
              </button>
            </form>
          )}

          {loadingComments ? (
            <div>Caricamento commenti...</div>
          ) : (
            <ul>
              {commentsList.map((comment, index) => (
                <Comment key={index} autore={comment.Utente.username} testo={comment.contenuto} datetime={comment.data_pubblicazione} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
