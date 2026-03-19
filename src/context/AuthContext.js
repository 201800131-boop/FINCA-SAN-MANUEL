import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsuarioByCredentials, getPermisosPorRol } from '../database/database';

const AuthContext = createContext(null);

const SESSION_KEY = 'finca_session';

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarSesion();
  }, []);

  const cargarSesion = async () => {
    try {
      const sesionGuardada = await AsyncStorage.getItem(SESSION_KEY);
      if (sesionGuardada) {
        const data = JSON.parse(sesionGuardada);
        setUsuario(data.usuario);
        setPermisos(data.permisos);
      }
    } catch (e) {
      console.log('Error cargando sesión:', e);
    } finally {
      setCargando(false);
    }
  };

  const iniciarSesion = async (nombreUsuario, contrasena) => {
    const usuarioEncontrado = getUsuarioByCredentials(nombreUsuario, contrasena);
    if (!usuarioEncontrado) {
      return { exito: false, mensaje: 'Usuario o contraseña incorrectos' };
    }
    if (!usuarioEncontrado.activo) {
      return { exito: false, mensaje: 'Este usuario está desactivado. Contacta al administrador.' };
    }

    const permisosRol = getPermisosPorRol(usuarioEncontrado.rol);

    const sesion = {
      usuario: usuarioEncontrado,
      permisos: permisosRol,
    };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    setUsuario(usuarioEncontrado);
    setPermisos(permisosRol);
    return { exito: true };
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUsuario(null);
    setPermisos(null);
  };

  const tienePermiso = (permiso) => {
    if (!permisos) return false;
    if (usuario?.rol === 'Admin') return true;
    return permisos[permiso] === 1;
  };

  const esAdmin = () => usuario?.rol === 'Admin';

  return (
    <AuthContext.Provider value={{
      usuario,
      permisos,
      cargando,
      iniciarSesion,
      cerrarSesion,
      tienePermiso,
      esAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
