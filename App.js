import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import { ROUTES } from './src/constants';
import { COLORS } from './src/constants/theme';
import { SplashScreen } from './src/screens/auth/SplashScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { DashboardScreen } from './src/screens/dashboard/DashboardScreen';
import { ListaVacasScreen } from './src/screens/ganado/ListaVacasScreen';
import { RegistrarVacaScreen } from './src/screens/ganado/RegistrarVacaScreen';
import { DetalleVacaScreen } from './src/screens/ganado/DetalleVacaScreen';
import { EditarVacaScreen } from './src/screens/ganado/EditarVacaScreen';
import { TratamientosHomeScreen } from './src/screens/tratamientos/TratamientosHomeScreen';
import { IniciarTratamientoScreen } from './src/screens/tratamientos/IniciarTratamientoScreen';
import { DetalleTratamientoScreen } from './src/screens/tratamientos/DetalleTratamientoScreen';
import { FinalizarTratamientoScreen } from './src/screens/tratamientos/FinalizarTratamientoScreen';
import { HistorialTratamientosScreen } from './src/screens/tratamientos/HistorialTratamientosScreen';
import { AjustesHomeScreen } from './src/screens/ajustes/AjustesHomeScreen';
import { UsuariosScreen } from './src/screens/ajustes/UsuariosScreen';
import { CrearUsuarioScreen } from './src/screens/ajustes/CrearUsuarioScreen';
import { EditarUsuarioScreen } from './src/screens/ajustes/EditarUsuarioScreen';
import { PermisosScreen } from './src/screens/ajustes/PermisosScreen';
import { CatalogoTratamientosScreen } from './src/screens/ajustes/CatalogoTratamientosScreen';
import { CrearCatalogoScreen } from './src/screens/ajustes/CrearCatalogoScreen';
import { ConfiguracionFincaScreen } from './src/screens/ajustes/ConfiguracionFincaScreen';
import { ProximamenteScreen } from './src/screens/ProximamenteScreen';

const RootStack = createNativeStackNavigator();
const GanadoStack = createNativeStackNavigator();
const TratamientosStack = createNativeStackNavigator();
const AjustesStack = createNativeStackNavigator();

const defaultScreenOptions = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: COLORS.textWhite,
  headerTitleStyle: { fontWeight: '700' },
  contentStyle: { backgroundColor: COLORS.background },
};

const GanadoNavigator = () => (
  <GanadoStack.Navigator screenOptions={defaultScreenOptions}>
    <GanadoStack.Screen
      name={ROUTES.LISTA_VACAS}
      component={ListaVacasScreen}
      options={{ title: 'Vacas registradas' }}
    />
    <GanadoStack.Screen
      name={ROUTES.REGISTRAR_VACA}
      component={RegistrarVacaScreen}
      options={{ title: 'Registrar vaca' }}
    />
    <GanadoStack.Screen
      name={ROUTES.DETALLE_VACA}
      component={DetalleVacaScreen}
      options={{ title: 'Detalle de vaca' }}
    />
    <GanadoStack.Screen
      name={ROUTES.EDITAR_VACA}
      component={EditarVacaScreen}
      options={{ title: 'Editar vaca' }}
    />
  </GanadoStack.Navigator>
);

const TratamientosNavigator = () => (
  <TratamientosStack.Navigator screenOptions={defaultScreenOptions}>
    <TratamientosStack.Screen
      name={ROUTES.TRATAMIENTOS_HOME}
      component={TratamientosHomeScreen}
      options={{ title: 'Tratamientos' }}
    />
    <TratamientosStack.Screen
      name={ROUTES.INICIAR_TRATAMIENTO}
      component={IniciarTratamientoScreen}
      options={{ title: 'Iniciar tratamiento' }}
    />
    <TratamientosStack.Screen
      name={ROUTES.DETALLE_TRATAMIENTO}
      component={DetalleTratamientoScreen}
      options={{ title: 'Detalle tratamiento' }}
    />
    <TratamientosStack.Screen
      name={ROUTES.FINALIZAR_TRATAMIENTO}
      component={FinalizarTratamientoScreen}
      options={{ title: 'Finalizar tratamiento' }}
    />
    <TratamientosStack.Screen
      name={ROUTES.HISTORIAL_TRATAMIENTOS}
      component={HistorialTratamientosScreen}
      options={{ title: 'Historial tratamientos' }}
    />
  </TratamientosStack.Navigator>
);

const AjustesNavigator = () => (
  <AjustesStack.Navigator screenOptions={defaultScreenOptions}>
    <AjustesStack.Screen
      name={ROUTES.AJUSTES_HOME}
      component={AjustesHomeScreen}
      options={{ title: 'Ajustes' }}
    />
    <AjustesStack.Screen
      name={ROUTES.USUARIOS}
      component={UsuariosScreen}
      options={{ title: 'Usuarios' }}
    />
    <AjustesStack.Screen
      name={ROUTES.CREAR_USUARIO}
      component={CrearUsuarioScreen}
      options={{ title: 'Crear usuario' }}
    />
    <AjustesStack.Screen
      name={ROUTES.EDITAR_USUARIO}
      component={EditarUsuarioScreen}
      options={{ title: 'Editar usuario' }}
    />
    <AjustesStack.Screen
      name={ROUTES.PERMISOS}
      component={PermisosScreen}
      options={{ title: 'Permisos' }}
    />
    <AjustesStack.Screen
      name={ROUTES.CATALOGO_TRATAMIENTOS}
      component={CatalogoTratamientosScreen}
      options={{ title: 'Catálogo tratamientos' }}
    />
    <AjustesStack.Screen
      name={ROUTES.CREAR_CATALOGO}
      component={CrearCatalogoScreen}
      options={{ title: 'Formulario catálogo' }}
    />
    <AjustesStack.Screen
      name={ROUTES.CONFIGURACION_FINCA}
      component={ConfiguracionFincaScreen}
      options={{ title: 'Configuración finca' }}
    />
  </AjustesStack.Navigator>
);

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.SPLASH}>
          <RootStack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
          <RootStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
          <RootStack.Screen name={ROUTES.DASHBOARD} component={DashboardScreen} />
          <RootStack.Screen name={ROUTES.GANADO_STACK} component={GanadoNavigator} />
          <RootStack.Screen name={ROUTES.TRATAMIENTOS_STACK} component={TratamientosNavigator} />
          <RootStack.Screen name={ROUTES.AJUSTES_STACK} component={AjustesNavigator} />
          <RootStack.Screen name={ROUTES.PROXIMAMENTE} component={ProximamenteScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}