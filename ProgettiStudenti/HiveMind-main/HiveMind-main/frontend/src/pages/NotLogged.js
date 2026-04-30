import { Link } from 'react-router-dom'

const NotLogged = () => {
    return (
    <div className="flex flex-col items-center justify-center bg-gray-900 text-white mt-40">        
        <h2 className="text-3xl mb-4">Non hai l'autorizzazione, effettua il login</h2>
        <Link to="/" className="text-blue-500 underline">Back to the HomePage..</Link>
    </div>
    )
}
export default NotLogged;