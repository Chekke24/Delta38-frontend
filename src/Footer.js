import React from "react";
import "./styles.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2025 Taller Mecánico Delta38. Todos los derechos reservados. Página desarrollada por F. Ortiz</p>
      <div className="footer-info">
        <p>
          Al utilizar nuestro sitio, aceptás los siguientes términos:
          <br /> • Los repuestos y servicios están sujetos a disponibilidad y diagnóstico técnico.
          <br /> • Los precios pueden modificarse sin previo aviso.
          <br /> • No nos responsabilizamos por daños derivados del uso indebido o instalación por terceros.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
