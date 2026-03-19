// Rutas de navegación
export const ROUTES = {
  // Auth
  SPLASH: 'Splash',
  LOGIN: 'Login',

  // Principal
  DASHBOARD: 'Dashboard',

  // Ganado
  GANADO_STACK: 'GanadoStack',
  LISTA_VACAS: 'ListaVacas',
  REGISTRAR_VACA: 'RegistrarVaca',
  DETALLE_VACA: 'DetalleVaca',
  EDITAR_VACA: 'EditarVaca',

  // Tratamientos
  TRATAMIENTOS_STACK: 'TratamientosStack',
  TRATAMIENTOS_HOME: 'TratamientosHome',
  INICIAR_TRATAMIENTO: 'IniciarTratamiento',
  DETALLE_TRATAMIENTO: 'DetalleTratamiento',
  FINALIZAR_TRATAMIENTO: 'FinalizarTratamiento',
  HISTORIAL_TRATAMIENTOS: 'HistorialTratamientos',

  // Ajustes
  AJUSTES_STACK: 'AjustesStack',
  AJUSTES_HOME: 'AjustesHome',
  USUARIOS: 'Usuarios',
  CREAR_USUARIO: 'CrearUsuario',
  EDITAR_USUARIO: 'EditarUsuario',
  PERMISOS: 'Permisos',
  CATALOGO_TRATAMIENTOS: 'CatalogoTratamientos',
  CREAR_CATALOGO: 'CrearCatalogo',
  CONFIGURACION_FINCA: 'ConfiguracionFinca',

  // Próximamente
  PROXIMAMENTE: 'Proximamente',
};

// Estados de vacas
export const ESTADOS_VACA = {
  ACTIVA: 'Activa',
  EN_TRATAMIENTO: 'En tratamiento',
  VENDIDA: 'Vendida',
  FALLECIDA: 'Fallecida',
  SECA: 'Seca',
};

// Estados de tratamientos
export const ESTADOS_TRATAMIENTO = {
  VIGENTE: 'Vigente',
  FINALIZADO: 'Finalizado',
  SUSPENDIDO: 'Suspendido',
};

// Resultados de tratamiento
export const RESULTADOS_TRATAMIENTO = {
  COMPLETADO: 'Completado',
  SUSPENDIDO: 'Suspendido',
  SIN_MEJORA: 'Sin mejora',
  MEJORO: 'Mejoró',
};

// Vías de administración
export const VIAS_ADMINISTRACION = [
  'Oral',
  'Intramuscular',
  'Intravenosa',
  'Subcutánea',
  'Tópica',
  'Intramamaria',
  'Otra',
];

// Razas comunes
export const RAZAS = [
  'Brahman',
  'Holstein',
  'Angus',
  'Simmental',
  'Normando',
  'Gyr',
  'Cebu',
  'Pardo Suizo',
  'Hereford',
  'Criollo',
  'Mestizo',
  'Otra',
];

// Sexo
export const SEXO = {
  HEMBRA: 'Hembra',
  MACHO: 'Macho',
};

// Estado reproductivo
export const ESTADO_REPRODUCTIVO = [
  'Preñada',
  'Vacía',
  'En celo',
  'Postparto',
  'Descartada',
];

// Roles de usuario
export const ROLES = {
  ADMIN: 'Admin',
  EMPLEADO: 'Empleado',
  CONSULTA: 'Consulta',
};

// Frecuencias de tratamiento
export const FRECUENCIAS = [
  'Cada 8 horas',
  'Cada 12 horas',
  'Una vez al día',
  'Cada 2 días',
  'Cada 3 días',
  'Semanal',
  'Dosis única',
  'Según indicación',
];
