import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const Header = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <>
      <li className="mr-6">
        <Link to="/profile" className="text-blue-600 hover:text-blue-800">
          My Profile
        </Link>
      </li>
      <li className="mr-6">
        <Link to="/profiles" className="text-blue-600 hover:text-blue-800">
          Browse Profiles
        </Link>
      </li>
      <li className="mr-6">
        <Link to="/chats" className="text-blue-600 hover:text-blue-800">
          Messages
        </Link>
      </li>
      <li>
        <a onClick={onLogout} href="#!" className="text-blue-600 hover:text-blue-800 cursor-pointer">
          Logout
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="mr-6">
        <Link to="/register" className="text-blue-600 hover:text-blue-800">
          Register
        </Link>
      </li>
      <li>
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          Login
        </Link>
      </li>
    </>
  );

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <span className="text-xl">JobPortal</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <ul className="flex">
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
