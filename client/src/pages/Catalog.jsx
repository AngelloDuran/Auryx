import React from "react";
import { Link } from "react-router-dom";

const Catalog = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo Auryx</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <Link to="/catalog/playeras" className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200">
          Playeras
        </Link>
        <Link to="/catalog/pantalones" className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200">
          Pantalones
        </Link>
        <Link to="/catalog/gorras" className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200">
          Gorras
        </Link>
        <Link to="/catalog/hoodies" className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200">
          Hoodies
        </Link>
        <Link to="/catalog/pana" className="p-6 bg-gray-100 rounded-lg shadow hover:bg-gray-200">
          Pans
        </Link>
      </div>
    </div>
  );
};

export default Catalog;

