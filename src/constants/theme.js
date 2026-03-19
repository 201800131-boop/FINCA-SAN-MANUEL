// Colores principales de la app - Finca San Manuel
export const COLORS = {
  // Primario - Verde ganadero
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  primaryBackground: '#E8F5E9',

  // Secundario - Café suave / tierra
  secondary: '#795548',
  secondaryLight: '#A1887F',
  secondaryDark: '#4E342E',

  // Fondos
  background: '#F9FBF9',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // Textos
  text: '#212121',
  textSecondary: '#616161',
  textLight: '#9E9E9E',
  textWhite: '#FFFFFF',

  // Estados de vacas
  statusActiva: '#4CAF50',
  statusTratamiento: '#FF9800',
  statusVendida: '#2196F3',
  statusFallecida: '#9E9E9E',
  statusSeca: '#795548',

  // Estados de tratamientos
  tratVigente: '#FF9800',
  tratFinalizado: '#4CAF50',
  tratSuspendido: '#F44336',

  // Utilitarios
  error: '#D32F2F',
  errorLight: '#FFEBEE',
  warning: '#F57C00',
  success: '#388E3C',
  info: '#1976D2',
  infoLight: '#E3F2FD',

  // Bordes
  border: '#E0E0E0',
  borderLight: '#F5F5F5',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
};

// Tipografías
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
};

// Espaciado base
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// Bordes redondeados
export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Sombras
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
};
