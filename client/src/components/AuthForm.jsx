import { useState } from 'react';

const AuthForm = ({ onSubmit, type }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 space-y-4">
      <input
        type="email"
        name="email"
        placeholder="Correo"
        className="w-full p-2 border rounded"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        className="w-full p-2 border rounded"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
      >
        {type === 'login' ? 'Iniciar sesión' : 'Registrarse'}
      </button>
    </form>
  );
};

export default AuthForm;
