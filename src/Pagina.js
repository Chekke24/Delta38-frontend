import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import AdminPanel from "./AdminPanel";
import "./styles.css";

const API_URL = process.env.REACT_APP_API_URL;

const Pagina = () => {
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [imagenIlustrativa, setImagenIlustrativa] = useState(null);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [marcaFiltro, setMarcaFiltro] = useState("");

  // Obtener resultados cuando se escribe en el buscador
  useEffect(() => {
    if (busqueda.trim() === "") {
      setProductosFiltrados([]);
      setImagenIlustrativa(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/repuestos?query=${busqueda}`);
        setProductosFiltrados(res.data.productos || []);
        setImagenIlustrativa(res.data.imagenIlustrativa || null);
      } catch (error) {
        console.error("Error al buscar productos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [busqueda]);

  const handleAdminOpen = () => {
    setMostrarAdmin(true);
  };

  // Filtro por marca
  const productosFiltradosConFiltro = productosFiltrados.filter((prod) => {
    return !marcaFiltro || prod.MARCA === marcaFiltro;
  });

  // Generar opciones únicas para el filtro de marca
  const marcasUnicas = [...new Set(productosFiltrados.map((p) => p.MARCA))];

  return (
    <div className="pagina">
      <Navbar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        onAdminClick={handleAdminOpen}
      />

      {mostrarAdmin && (
        <>
          <div className="modal-overlay" onClick={() => setMostrarAdmin(false)} />
          <div className="modal-admin">
            <button className="close" onClick={() => setMostrarAdmin(false)}>
              ×
            </button>
            <AdminPanel />
          </div>
        </>
      )}

      {isLoading && <div className="loader"></div>}

      {busqueda && (
        <div className="resultados">
          {imagenIlustrativa && (
            <div className="imagen-ilustrativa">
              <img src={imagenIlustrativa} alt="Imagen ilustrativa" />
            </div>
          )}

          <div className="filtros">
            <select onChange={(e) => setMarcaFiltro(e.target.value)}>
              <option value="">Todas las marcas</option>
              {marcasUnicas.map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>
          </div>

          <div className="listado-productos">
            {productosFiltradosConFiltro.length === 0 ? (
              <p>No se encontraron productos para "{busqueda}".</p>
            ) : (
              <table className="tabla-stock">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Marca</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltradosConFiltro.map((prod, index) => (
                    <tr key={index}>
                      <td>{prod.CODIGO}</td>
                      <td>{prod.MARCA}</td>
                      <td>{prod.STOCK}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagina;
