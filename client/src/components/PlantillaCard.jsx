import React from "react";
import { Link } from "react-router-dom";

const PlantillaCard = ({ nombre, imagen, link }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer">
      <img
        src={imagen}
        alt={nombre}
        className="w-full h-48 object-contain p-4 rounded-t-2xl"
      />
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold mb-2">{nombre}</h2>
        <Link
          to={link}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Personalizar
        </Link>
      </div>
    </div>
  );
};

export default PlantillaCard;
