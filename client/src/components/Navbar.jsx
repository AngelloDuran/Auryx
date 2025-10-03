import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-300 transition-colors">
            Auryx
          </Link>
        </div>

        {/* Botón menú hamburguesa (móvil) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Links */}
        <div className={`flex-col md:flex md:flex-row md:space-x-4 items-center ${isOpen ? "flex" : "hidden"} md:!flex`}>
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 ease-in-out"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-200 ease-in-out"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-all duration-200 ease-in-out"
              >
                Dashboard
              </Link>

              {/* Nombre + foto del usuario */}
              <div className="flex items-center space-x-2">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-gray-600"
                  />
                )}
                <span className="text-sm">{user.name || user.email}</span>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 ease-in-out"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
