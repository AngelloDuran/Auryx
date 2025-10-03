import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { googleLogin } from "../services/api";
import { Link } from "react-router-dom"; 

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Crear una cuenta
        </h1>
        <p className="mb-8 text-gray-500">
          ¿Ya eres miembro?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              placeholder=""
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder=""
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder=""
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Registrarse
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-4 text-gray-500 text-sm">o continuar con</span>
          <hr className="flex-grow border-gray-300" />
        </div>

         {/* Social Login Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={googleLogin}
                    className="w-1/2 flex items-center justify-center px-2 py-3 border border-gray-300 rounded-md shadow-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="h-5 w-5 mr-2" />   
                  </button>
                  {/* Add a button for Github or other social logins if needed */}
                </div>
              </div>
            </div>
          );
        };
export default Register;