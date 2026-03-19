import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import {
  getConteoVacas,
  getConteoTratamientosVigentes,
  getResumenVacas,
} from '../../database/database';

const ModuleButton = ({ icon, label, color, bg, onPress, badge }) => (
  <TouchableOpacity
    style={[styles.moduleBtn, { backgroundColor: COLORS.surface }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.moduleBtnIcon, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={32} color={color} />
    </View>
    <Text style={styles.moduleBtnLabel}>{label}</Text>
    {badge != null && badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
      </View>
    )}
  </TouchableOpacity>
);

export const DashboardScreen = ({ navigation }) => {
  const { usuario, cerrarSesion, tienePermiso, esAdmin } = useAuth();
  const [resumen, setResumen] = useState({
    totalVacas: 0,
    tratamientosVigentes: 0,
    vacasPorEstado: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const cargarResumen = useCallback(() => {
    try {
      const totalVacas = getConteoVacas();
      const tratamientosVigentes = getConteoTratamientosVigentes();
      const vacasPorEstado = getResumenVacas();
      setResumen({
        totalVacas: totalVacas?.total || 0,
        tratamientosVigentes: tratamientosVigentes?.total || 0,
        vacasPorEstado: vacasPorEstado || [],
      });
    } catch (e) {
      console.log('Error cargando resumen:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarResumen();
    }, [cargarResumen])
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarResumen();
    setRefreshing(false);
  };

  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await cerrarSesion();
            navigation.replace(ROUTES.LOGIN);
          },
        },
      ]
    );
  };

  const getHora = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const vacasActivas = resumen.vacasPorEstado.find((v) => v.estado === 'Activa')?.total || 0;
  const puedeVerVacas = tienePermiso('puede_ver_vacas');
  const puedeRegistrarVacas = tienePermiso('puede_registrar_vacas');
  const puedeGestionarTratamientos =
    tienePermiso('puede_iniciar_tratamientos') || tienePermiso('puede_finalizar_tratamientos');
  const puedeVerAjustes = esAdmin() || tienePermiso('puede_ver_ajustes');

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.saludo}>{getHora()},</Text>
            <Text style={styles.nombreUsuario}>{usuario?.nombre || 'Usuario'}</Text>
            <View style={styles.rolChip}>
              <Ionicons name="shield-checkmark-outline" size={12} color={COLORS.textWhite} />
              <Text style={styles.rolText}>{usuario?.rol}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleCerrarSesion} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.textWhite} />
          </TouchableOpacity>
        </View>

        {/* Stats rápidas */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{resumen.totalVacas}</Text>
            <Text style={styles.statLbl}>Total vacas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{vacasActivas}</Text>
            <Text style={styles.statLbl}>Activas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, resumen.tratamientosVigentes > 0 && styles.statNumWarning]}>
              {resumen.tratamientosVigentes}
            </Text>
            <Text style={styles.statLbl}>En tratamiento</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Finca */}
      <View style={styles.fincaLabel}>
        <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.fincaText}>Finca San Manuel</Text>
      </View>

      {/* Módulos principales */}
      <Text style={styles.sectionTitle}>Menú principal</Text>
      <View style={styles.grid}>
        {puedeRegistrarVacas && (
          <ModuleButton
            icon="add-circle-outline"
            label="Registrar vaca"
            color="#2E7D32"
            bg="#E8F5E9"
            onPress={() => navigation.navigate(ROUTES.GANADO_STACK, { screen: ROUTES.REGISTRAR_VACA })}
          />
        )}
        {puedeGestionarTratamientos && (
          <ModuleButton
            icon="medkit-outline"
            label="Tratamientos"
            color="#E65100"
            bg="#FFF3E0"
            badge={resumen.tratamientosVigentes}
            onPress={() => navigation.navigate(ROUTES.TRATAMIENTOS_STACK, { screen: ROUTES.TRATAMIENTOS_HOME })}
          />
        )}
        {puedeVerVacas && (
          <ModuleButton
            icon="list-outline"
            label="Vacas registradas"
            color="#1565C0"
            bg="#E3F2FD"
            badge={resumen.totalVacas}
            onPress={() => navigation.navigate(ROUTES.GANADO_STACK, { screen: ROUTES.LISTA_VACAS })}
          />
        )}
        {puedeVerAjustes && (
          <ModuleButton
            icon="settings-outline"
            label="Ajustes"
            color="#4A148C"
            bg="#F3E5F5"
            onPress={() => navigation.navigate(ROUTES.AJUSTES_STACK, { screen: ROUTES.AJUSTES_HOME })}
          />
        )}
      </View>

      {/* Próximamente */}
      <TouchableOpacity
        style={styles.proximamente}
        onPress={() => navigation.navigate(ROUTES.PROXIMAMENTE)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#37474F', '#546E7A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.proximamenteGradient}
        >
          <View style={styles.proximamenteContent}>
            <Ionicons name="time-outline" size={28} color={COLORS.textWhite} />
            <View style={styles.proximamenteTexts}>
              <Text style={styles.proximamenteTitulo}>Gestión Financiera</Text>
              <Text style={styles.proximamenteSubtitulo}>Ingresos y egresos · Disponible próximamente</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Resumen de estado del hato */}
      {resumen.vacasPorEstado.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado del hato</Text>
          <View style={styles.estadoCard}>
            {resumen.vacasPorEstado.map((item) => (
              <View key={item.estado} style={styles.estadoRow}>
                <View style={[styles.estadoDot, { backgroundColor: getColorEstado(item.estado) }]} />
                <Text style={styles.estadoLabel}>{item.estado}</Text>
                <Text style={styles.estadoNum}>{item.total}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={{ height: SPACING.xxxl }} />
    </ScrollView>
  );
};

const getColorEstado = (estado) => {
  const mapa = {
    'Activa': COLORS.statusActiva,
    'En tratamiento': COLORS.statusTratamiento,
    'Vendida': COLORS.statusVendida,
    'Fallecida': COLORS.statusFallecida,
    'Seca': COLORS.statusSeca,
  };
  return mapa[estado] || COLORS.textSecondary;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: SPACING.xxxl + SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: BORDER_RADIUS.xl + 4,
    borderBottomRightRadius: BORDER_RADIUS.xl + 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  saludo: { fontSize: FONTS.sizes.md, color: 'rgba(255,255,255,0.75)' },
  nombreUsuario: {
    fontSize: FONTS.sizes.xl + 2,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  rolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  rolText: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 2,
  },
  logoutBtn: {
    padding: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  statNum: {
    fontSize: FONTS.sizes.xxl + 2,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  statNumWarning: { color: '#FFD54F' },
  statLbl: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  fincaLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
    gap: 4,
  },
  fincaText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  moduleBtn: {
    width: '47%',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    position: 'relative',
    ...SHADOWS.medium,
  },
  moduleBtnIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  moduleBtnLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: COLORS.textWhite, fontSize: FONTS.sizes.xs, fontWeight: '800' },
  proximamente: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  proximamenteGradient: { borderRadius: BORDER_RADIUS.lg },
  proximamenteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  proximamenteTexts: { flex: 1 },
  proximamenteTitulo: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  proximamenteSubtitulo: {
    fontSize: FONTS.sizes.xs,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.md },
  estadoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  estadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  estadoDot: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.md },
  estadoLabel: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text },
  estadoNum: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
});
