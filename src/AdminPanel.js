// Archivo: AdminPanel.jsx

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFileExcel, FaImages, FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
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
      toast.success("Bienvenido, administrador.");
    } else {
      toast.error("Usuario o contraseña incorrectos");
    }
  };

  const handleExcelSubmit = async (e) => {
    e.preventDefault();
    if (!excelFile) return toast.warn("Debe seleccionar un archivo Excel.");
    setCargandoExcel(true);

    const formData = new FormData();
    formData.append("archivo", excelFile);

    try {
       await axios.post(`${API_URL}/stock/excel`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Excel cargado correctamente.");
      setExcelFile(null);
    } catch (error) {
      toast.error("❌ Error al cargar Excel. Verifica formato o conexión.");
    } finally {
      setCargandoExcel(false);
    }
  };

  const handleImagenesSubmit = async (e) => {
    e.preventDefault();
    if (imagenes.length === 0) return toast.warn("Debe subir al menos una imagen.");
    setCargandoImagenes(true);

    const formData = new FormData();
    imagenes.forEach((img) => {
      formData.append("imagenes", img);
    });

    try {
      await axios.post(`${API_URL}/imagenes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Imágenes subidas correctamente.");
      setImagenes([]);
    } catch (error) {
      toast.error("❌ Error al subir imágenes. Verifica la conexión.");
    } finally {
      setCargandoImagenes(false);
    }
  };

  const handleEliminarRepuestos = async () => {
    if (!window.confirm("¿Estás seguro que querés eliminar TODOS los repuestos?")) return;

    try {
      await axios.delete(`${API_URL}/stock/eliminar-todo`);
      toast.success("✅ Repuestos eliminados correctamente.");
    } catch (error) {
      toast.error("❌ Error al eliminar repuestos. Verifica la conexión.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setModalVisible(false);
    toast.info("Sesión cerrada");
  };

  return (
    <div className="admin-panel">
      <ToastContainer />
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
              <button className="logout-btn" onClick={handleLogout}><FaSignOutAlt /> Cerrar sesión</button>
              <div className="panel-contenido">
                <h2>Gestión del Taller</h2>

                <section>
                  <h3><FaFileExcel /> Subir Excel de repuestos</h3>
                  <form onSubmit={handleExcelSubmit}>
                    <input type="file" accept=".xlsx, .xls, .xlsm" onChange={(e) => setExcelFile(e.target.files[0])} required />
                    {excelFile && <p className="file-preview">📄 {excelFile.name}</p>}
                    <button type="submit" className="btn green" disabled={cargandoExcel}>
                      {cargandoExcel ? <span className="loader"></span> : "Subir Excel"}
                    </button>
                  </form>
                </section>

                <section>
                  <h3><FaImages /> Subir imágenes ilustrativas</h3>
                  <form onSubmit={handleImagenesSubmit}>
                    <input type="file" accept="image/*" multiple onChange={(e) => setImagenes(Array.from(e.target.files).slice(0, 10))} required />
                    <div className="preview-imgs">
                      {imagenes.map((img, i) => (
                        <img key={i} src={URL.createObjectURL(img)} alt={`img-${i}`} className="mini" />
                      ))}
                    </div>
                    <button type="submit" className="btn blue" disabled={cargandoImagenes}>
                      {cargandoImagenes ? <span className="loader"></span> : "Subir Imágenes"}
                    </button>
                  </form>
                </section>

                <section>
                  <h3><FaTrashAlt /> Eliminar todos los repuestos</h3>
                  <button className="btn red" onClick={handleEliminarRepuestos}>Eliminar Repuestos</button>
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
