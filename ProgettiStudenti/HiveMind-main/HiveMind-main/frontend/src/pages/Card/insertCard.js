import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Stili dell'editor di testo ricco
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContex.js';

function RichTextEditor() {
  const [descrizione, setEditorHtml] = useState('');
  const [titolo, setTitle] = useState('');
  const { username } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Stato per il messaggio di successo
  const history = useNavigate();

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link',
  ];

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorHtml(editor.getHTML());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (descrizione.length > 400) {
      setError('La descrizione non può superare i 400 caratteri.');
      return;
    }

    setError(null); // Resetta l'errore se tutto va bene

    try {
      const response = await axios.post('http://localhost:5000/registerIdea', {
        titolo,
        descrizione,
        username,
      }, { withCredentials: true });

      if (response.status === 200) {
        setSuccess('Idea inserita con successo!'); // Imposta il messaggio di successo
        setTimeout(() => {
          setSuccess(null); // Nascondi il messaggio dopo 5 secondi
          history('/homepage');
        }, 5000);
      }
    } catch (error) {
      console.error('Errore nella richiesta:', error);
      if (error.response) {
        setError(`Errore: ${error.response.data.message}`);
      } else if (error.request) {
        setError('Nessuna risposta dal server');
      } else {
        setError('Errore nella configurazione della richiesta');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-500 mb-20">
      <div className="flex-grow">
        <div className="mx-auto my-4 p-6 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 mt-20 bg-white shadow-lg rounded-lg overflow-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">Crea la tua idea</h1>
          
          <input 
            type="text" 
            placeholder="Inserisci il titolo" 
            value={titolo} 
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 mb-4"
          />
          
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={descrizione}
            onChange={handleEditorChange}
            className="bg-white border border-gray-300 rounded-lg mb-4 w-full shadow-sm"
            style={{ minHeight: '250px', padding: '10px' }}
          />
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Errore!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Successo!</strong>
              <span className="block sm:inline"> {success}</span>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out text-white font-semibold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;
