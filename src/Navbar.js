import React from "react";
import "./styles.css";
import { FaInstagram, FaWhatsapp, FaUserCog } from "react-icons/fa";

const Navbar = ({ busqueda, setBusqueda, onAdminClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">Taller Delta38</h1>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          className="navbar-search"
          placeholder="Buscar repuesto (ej: bujes, filtros...)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="navbar-right">
        <a
          href="https://instagram.com/tallerdelta38"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="icon" />
        </a>
        <a
          href="https://wa.me/+5493434050809"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="icon" />
        </a>
        <button className="admin-icon" onClick={onAdminClick}>
          <FaUserCog />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
