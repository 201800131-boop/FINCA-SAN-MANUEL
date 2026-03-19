import React, { useCallback, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { Card, EmptyState, InfoRow, SectionHeader, StatusBadge } from '../../components/UI';
import { ESTADOS_VACA, ROUTES } from '../../constants';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../../constants/theme';
import {
  cambiarEstadoVaca,
  getTratamientosPorVaca,
  getUsuarioById,
  getVacaById,
} from '../../database/database';
import { useAuth } from '../../context/AuthContext';

export const DetalleVacaScreen = ({ navigation, route }) => {
  const { tienePermiso } = useAuth();
  const { vacaId } = route.params;
  const [vaca, setVaca] = useState(null);
  const [tratamientos, setTratamientos] = useState([]);
  const [creador, setCreador] = useState(null);

  const cargar = useCallback(() => {
    const registro = getVacaById(vacaId);
    setVaca(registro || null);
    setTratamientos(getTratamientosPorVaca(vacaId) || []);
    setCreador(registro?.creado_por ? getUsuarioById(registro.creado_por) : null);
  }, [vacaId]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const handleCambiarEstado = () => {
    if (!vaca) {
      return;
    }

    const opciones = Object.values(ESTADOS_VACA).filter((estado) => estado !== vaca.estado);
    Alert.alert(
      'Cambiar estado',
      'Selecciona el nuevo estado de la vaca',
      [
        ...opciones.map((estado) => ({
          text: estado,
          onPress: () => {
            cambiarEstadoVaca(vaca.id, estado);
            cargar();
          },
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  if (!vaca) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Vaca no encontrada"
        subtitle="No fue posible cargar la información solicitada."
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View>
            <Text style={styles.nombre}>{vaca.nombre}</Text>
            <Text style={styles.codigo}>Código: {vaca.codigo}</Text>
            {vaca.numero_arete ? <Text style={styles.meta}>Arete: {vaca.numero_arete}</Text> : null}
          </View>
          <StatusBadge estado={vaca.estado} />
        </View>
        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaChip}>
            <Ionicons name="ribbon-outline" size={14} color={COLORS.secondary} />
            <Text style={styles.heroMetaText}>{vaca.raza}</Text>
          </View>
          <View style={styles.heroMetaChip}>
            <Ionicons name="water-outline" size={14} color={COLORS.info} />
            <Text style={styles.heroMetaText}>{vaca.produccion_leche_dia || 0} L/día</Text>
          </View>
        </View>
      </Card>

      <SectionHeader title="Información general" />
      <Card>
        <InfoRow label="Sexo" value={vaca.sexo} icon="female-outline" />
        <InfoRow label="Fecha de nacimiento" value={vaca.fecha_nacimiento} icon="calendar-outline" />
        <InfoRow label="Edad aproximada" value={vaca.edad_aproximada} icon="time-outline" />
        <InfoRow label="Fecha de ingreso" value={vaca.fecha_ingreso} icon="enter-outline" />
        <InfoRow label="Procedencia" value={vaca.procedencia} icon="location-outline" />
      </Card>

      <SectionHeader title="Producción" />
      <Card>
        <InfoRow label="Producción de leche" value={`${vaca.produccion_leche_dia || 0} L/día`} icon="water-outline" />
      </Card>

      <SectionHeader title="Estado de salud" />
      <Card>
        <InfoRow label="Estado de salud" value={vaca.estado_salud} icon="medkit-outline" />
        <InfoRow label="Última revisión" value={vaca.ultima_revision} icon="calendar-outline" />
        <InfoRow label="Alergias o notas" value={vaca.alergias_notas} icon="alert-circle-outline" />
      </Card>

      <SectionHeader title="Datos reproductivos" />
      <Card>
        <InfoRow label="Número de partos" value={String(vaca.numero_partos || 0)} icon="stats-chart-outline" />
        <InfoRow label="Último parto" value={vaca.ultimo_parto} icon="calendar-outline" />
        <InfoRow label="Estado reproductivo" value={vaca.estado_reproductivo} icon="git-branch-outline" />
      </Card>

      <SectionHeader title="Historial de tratamientos" />
      <Card>
        {tratamientos.length === 0 ? (
          <Text style={styles.emptyText}>No hay tratamientos registrados para esta vaca.</Text>
        ) : (
          tratamientos.map((tratamiento) => (
            <View key={tratamiento.id} style={styles.tratamientoRow}>
              <View style={styles.tratamientoLeft}>
                <Text style={styles.tratamientoTitulo}>
                  {tratamiento.tratamiento_manual || tratamiento.descripcion || 'Tratamiento'}
                </Text>
                <Text style={styles.tratamientoSubtitulo}>Inicio: {tratamiento.fecha_inicio || '-'}</Text>
              </View>
              <StatusBadge estado={tratamiento.estado} />
            </View>
          ))
        )}
      </Card>

      <SectionHeader title="Observaciones" />
      <Card>
        <Text style={styles.observaciones}>{vaca.observaciones || 'Sin observaciones registradas.'}</Text>
      </Card>

      <SectionHeader title="Registro" />
      <Card>
        <InfoRow label="Fecha de registro" value={vaca.fecha_creacion} icon="calendar-clear-outline" />
        <InfoRow label="Registrado por" value={creador?.nombre || 'No disponible'} icon="person-outline" />
      </Card>

      <View style={styles.actions}>
        {tienePermiso('puede_editar_vacas') && (
          <Button title="Editar vaca" onPress={() => navigation.navigate(ROUTES.EDITAR_VACA, { vacaId })} style={styles.actionButton} />
        )}
        {tienePermiso('puede_iniciar_tratamientos') && (
          <Button
            title="Iniciar tratamiento"
            variant="outline"
            onPress={() => navigation.navigate(ROUTES.TRATAMIENTOS_STACK, { screen: ROUTES.TRATAMIENTOS_HOME })}
            style={styles.actionButton}
          />
        )}
        <Button
          title="Ver historial"
          variant="outline"
          onPress={() => navigation.navigate(ROUTES.TRATAMIENTOS_STACK, { screen: ROUTES.TRATAMIENTOS_HOME })}
          style={styles.actionButton}
        />
        {tienePermiso('puede_editar_vacas') && (
          <TouchableOpacity style={styles.stateButton} onPress={handleCambiarEstado} activeOpacity={0.85}>
            <Ionicons name="swap-horizontal-outline" size={18} color={COLORS.primary} />
            <Text style={styles.stateButtonText}>Cambiar estado</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  heroCard: {
    marginBottom: SPACING.sm,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nombre: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  codigo: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  meta: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  heroMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.borderLight,
  },
  heroMetaText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  tratamientoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tratamientoLeft: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  tratamientoTitulo: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  tratamientoSubtitulo: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  observaciones: {
    fontSize: FONTS.sizes.sm,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  actions: {
    marginTop: SPACING.md,
  },
  actionButton: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  stateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryBackground,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.small,
  },
  stateButtonText: {
    marginLeft: SPACING.xs,
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
});