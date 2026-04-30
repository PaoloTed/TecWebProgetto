const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="#" className="hover:underline">Carmine Guarracino™</a>. All Rights Reserved.</span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                <li>
                    <a href="https://github.com/FulmineGiallo/HiveMind" className="flex items-center hover:underline me-4 md:me-6">
                        Github
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
                            alt="GitHub"
                            className="w-10 h-6 ml-2"
                        />
                    </a>

                </li>
                <li>
                    <a href="https://www.zooplus.it/magazine/wp-content/uploads/2020/05/1-4.jpg" className="hover:underline me-4 md:me-6">Licensing</a>
                </li>
                <li>
                    <a href="https://fulminegiallo.github.io/" className="hover:underline">Contact</a>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;
