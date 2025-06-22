import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

const API_URL = process.env.REACT_APP_API_URL;

const AdminPanel = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cargandoExcel, setCargandoExcel] = useState(false);
  const [cargandoImagenes, setCargandoImagenes] = useState(false);

  const adminUser = { username: "delta38", password: "malo100" };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === adminUser.username && password === adminUser.password) {
      setIsLoggedIn(true);
      setModalVisible(true);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  const handleExcelSubmit = async (e) => {
    e.preventDefault();
    if (!excelFile) return alert("Debe seleccionar un archivo Excel.");
    setCargandoExcel(true);

    const formData = new FormData();
    formData.append("archivo", excelFile);

    try {
      await axios.post(`${API_URL}/stock/excel`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("✅ Stock cargado correctamente desde Excel.");
      setExcelFile(null);
    } catch (error) {
      console.error("❌ Error al cargar Excel:", error);
      alert("❌ Error al cargar Excel. Verifica el formato o la conexión.");
    } finally {
      setCargandoExcel(false);
    }
  };

  const handleImagenesSubmit = async (e) => {
    e.preventDefault();
    if (imagenes.length === 0) return alert("Debe subir al menos una imagen.");
    setCargandoImagenes(true);

    const formData = new FormData();
    imagenes.forEach((img) => {
      formData.append("imagenes", img);
    });

    try {
      await axios.post(`${API_URL}/imagenes`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("✅ Imágenes cargadas correctamente.");
      setImagenes([]);
    } catch (error) {
      console.error("❌ Error al subir imágenes:", error);
      alert("❌ Error al subir imágenes. Verifica la conexión.");
    } finally {
      setCargandoImagenes(false);
    }
  };

  return (
    <div className="admin-panel">
      {!isLoggedIn ? (
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Acceso Administrador</h2>
          <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Ingresar</button>
        </form>
      ) : (
        modalVisible && (
          <div className="modal" onClick={() => setModalVisible(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
              <div className="panel-contenido">
                <h2>Gestión del Taller</h2>

                <section>
                  <h3>📦 Subir archivo Excel de repuestos</h3>
                  <form onSubmit={handleExcelSubmit}>
                    <input
                      type="file"
                      accept=".xlsx, .xls, .xlsm"
                      onChange={(e) => setExcelFile(e.target.files[0])}
                      required
                    />
                    <button type="submit" disabled={cargandoExcel}>
                      {cargandoExcel ? (
                        <span className="loader"></span>
                      ) : (
                        "Subir Excel"
                      )}
                    </button>
                  </form>
                </section>

                <section>
                  <h3>🖼️ Subir imágenes ilustrativas (hasta 10)</h3>
                  <form onSubmit={handleImagenesSubmit}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setImagenes(Array.from(e.target.files).slice(0, 10))}
                      required
                    />
                    <button type="submit" disabled={cargandoImagenes}>
                      {cargandoImagenes ? (
                        <span className="loader"></span>
                      ) : (
                        "Subir Imágenes"
                      )}
                    </button>
                  </form>
                </section>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AdminPanel;
