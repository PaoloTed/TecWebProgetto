import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Stili dell'editor di testo ricco
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContex.js'

function RichTextEditor() {
  const [descrizione, setEditorHtml] = useState('');
  const [titolo, setTitle] = useState('');
  const { username } = useAuth();
  const [ error, setError] = useState(null);
  const history = useNavigate();

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'},],
      ['link'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link'
  ];
  const handleEditorChange = (content, delta, source, editor) => {
    setEditorHtml(editor.getHTML());
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    console.log("Titolo:", titolo);
    console.log("Contenuto dell'editor:", descrizione);
    console.log("Username:", username);
    
    try {
      const response = await axios.post('http://localhost:5000/registerIdea', {
        titolo,
        descrizione,
        username
      }, { withCredentials: true });

      if (response.status === 200) {
        history('/');
      }
    } catch (error) {
      console.error('Errore nella richiesta:', error);
      if (error.response) {
        // La richiesta è stata fatta e il server ha risposto con uno status code
        // che non rientra nel range dei 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        setError(`Errore: ${error.response.data.message}`);
      } else if (error.request) {
        // La richiesta è stata fatta ma non è stata ricevuta alcuna risposta
        console.error('Request data:', error.request);
        setError('Nessuna risposta dal server');
      } else {
        // Qualcosa è successo nella configurazione della richiesta che ha triggerato l'errore
        console.error('Error message:', error.message);
        setError('Errore nella configurazione della richiesta');
      }
      console.error('Error config:', error.config);
    }
  };

  return (
    <div className="mx-auto my-4 p-4 w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
      <input 
        type="text" 
        placeholder="Inserisci il titolo" 
        value={titolo} 
        onChange={(e) => setTitle(e.target.value)}
        className="bg-white border rounded-lg mb-4 w-full p-2"
      />
      <ReactQuill 
        theme="snow" 
        modules={modules}
        formats={formats}
        value={descrizione} 
        onChange={handleEditorChange}
        className="bg-white border rounded-lg mb-4 w-full"
        style={{ minHeight: '250px' }} // Imposta l'altezza minima dell'editor
      />
      <div>
        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
      </div>
      
      <div>
        <h3 className="text-lg mb-2">Contenuto dell'editor:</h3>
        <div className="prose" dangerouslySetInnerHTML={{ __html: descrizione }} />
      </div>
    </div>
  );
}

export default RichTextEditor;
