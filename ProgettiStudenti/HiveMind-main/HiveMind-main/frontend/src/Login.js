import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContex.js'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [message, setMessage] = useState('');
  //const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useNavigate();
  const { setIsLoggedIn, setUsername } = useAuth();

  const handleSubmit = async (e) => 
  {
    e.preventDefault();
    console.log("Email : " + email);
    console.log("Password: " + password);
   
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      }, { withCredentials: true });

      if (response.status === 200) {
        history('/');
        setIsLoggedIn(true);
        setUsername(response.data.user.username); // Imposta l'username
      }
    } catch (error) {
      setError('Email o password non validi');
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center px-6 py-6 mx-auto my-10 md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
          HiveMind    
        </a>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  name="email" 
                  id="email" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="name.cognome@studenti.unina.it" 
                  required 
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  name="password" 
                  id="password" 
                  placeholder="••••••••" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  required 
                />
              </div>
              <button type="submit" className="w-full text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Sign in</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Non hai ancora un account? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Registrati</a>
              </p>
            </form>
          </div>
        </div>
        
        {error && <div>Si è verificato un errore: {error.message}</div>}
      
      </div>
    </section>
  );
};

export default Login;
