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
  const [modeloFiltro, setModeloFiltro] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("");

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

  const productosFiltradosConFiltro = productosFiltrados.filter((prod) => {
    return (
      (!marcaFiltro || prod.marca === marcaFiltro) &&
      (!modeloFiltro || prod.modelo === modeloFiltro) &&
      (!anioFiltro || prod.anio === anioFiltro)
    );
  });

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
              <option value="Toyota">Toyota</option>
              <option value="Ford">Ford</option>
              <option value="Chevrolet">Chevrolet</option>
            </select>
            <select onChange={(e) => setModeloFiltro(e.target.value)}>
              <option value="">Todos los modelos</option>
              <option value="Corolla">Corolla</option>
              <option value="Focus">Focus</option>
              <option value="Onix">Onix</option>
            </select>
            <select onChange={(e) => setAnioFiltro(e.target.value)}>
              <option value="">Todos los años</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="listado-productos">
            {productosFiltradosConFiltro.length === 0 ? (
              <p>No se encontraron productos para "{busqueda}".</p>
            ) : (
              <table className="tabla-stock">
                <thead>
                  <tr>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Año</th>
                    <th>Código</th>
                    <th>Solicitar</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltradosConFiltro.map((prod) => (
                    <tr key={prod.id}>
                      <td>{prod.marca}</td>
                      <td>{prod.modelo}</td>
                      <td>{prod.anio}</td>
                      <td>{prod.codigo}</td>
                      <td>
                        <a
                          href={`https://wa.me/+5493434050809?text=Hola! Me interesa este repuesto:%0A🔧 *Código:* ${prod.codigo}%0A🚗 *Marca:* ${prod.marca}%0A📘 *Modelo:* ${prod.modelo}%0A📅 *Año:* ${prod.anio}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-button"
                        >
                          WhatsApp
                        </a>
                      </td>
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