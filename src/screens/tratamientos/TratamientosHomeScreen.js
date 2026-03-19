import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { Card, SectionHeader, StatusBadge } from '../../components/UI';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../../constants/theme';
import { ESTADOS_TRATAMIENTO, ROUTES } from '../../constants';
import { getTratamientos } from '../../database/database';
import { useAuth } from '../../context/AuthContext';

const FILTERS = {
  VIGENTES: 'vigentes',
  FINALIZADOS: 'finalizados',
  TODOS: 'todos',
};

const diasTranscurridos = (fechaInicio) => {
  if (!fechaInicio) return 0;
  const inicio = new Date(fechaInicio);
  if (Number.isNaN(inicio.getTime())) return 0;
  const diff = Date.now() - inicio.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

export const TratamientosHomeScreen = ({ navigation }) => {
  const { tienePermiso } = useAuth();
  const [filtro, setFiltro] = useState(FILTERS.VIGENTES);
  const [tratamientos, setTratamientos] = useState([]);
  const puedeIniciar = tienePermiso('puede_iniciar_tratamientos');
  const puedeFinalizar = tienePermiso('puede_finalizar_tratamientos');

  const cargar = useCallback(() => {
    const estado = filtro === FILTERS.TODOS
      ? undefined
      : filtro === FILTERS.VIGENTES
        ? ESTADOS_TRATAMIENTO.VIGENTE
        : ESTADOS_TRATAMIENTO.FINALIZADO;
    setTratamientos(getTratamientos({ estado }));
  }, [filtro]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const totalVigentes = useMemo(
    () => getTratamientos({ estado: ESTADOS_TRATAMIENTO.VIGENTE }).length,
    [tratamientos]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        {puedeIniciar && (
          <Button
            title="Iniciar tratamiento"
            style={styles.mainButton}
            onPress={() => navigation.navigate(ROUTES.INICIAR_TRATAMIENTO)}
          />
        )}
        <Button
          title="Ver historial"
          variant="outline"
          style={styles.mainButton}
          onPress={() => navigation.navigate(ROUTES.HISTORIAL_TRATAMIENTOS)}
        />
      </Card>

      <SectionHeader title="Tratamientos vigentes" />
      <Card>
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, filtro === FILTERS.VIGENTES && styles.filterChipActive]}
            onPress={() => setFiltro(FILTERS.VIGENTES)}
          >
            <Text style={[styles.filterText, filtro === FILTERS.VIGENTES && styles.filterTextActive]}>Vigentes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filtro === FILTERS.FINALIZADOS && styles.filterChipActive]}
            onPress={() => setFiltro(FILTERS.FINALIZADOS)}
          >
            <Text style={[styles.filterText, filtro === FILTERS.FINALIZADOS && styles.filterTextActive]}>Finalizados</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, filtro === FILTERS.TODOS && styles.filterChipActive]}
            onPress={() => setFiltro(FILTERS.TODOS)}
          >
            <Text style={[styles.filterText, filtro === FILTERS.TODOS && styles.filterTextActive]}>Todos</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.note}>Vigentes actualmente: {totalVigentes}</Text>
        {tratamientos.length === 0 ? (
          <Text style={styles.emptyText}>No hay tratamientos para este filtro.</Text>
        ) : (
          tratamientos.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.placeholderLeft}>
                <Text style={styles.placeholderTitle}>{item.vaca_nombre || item.vaca_codigo}</Text>
                <Text style={styles.placeholderSubtitle}>
                  {item.tratamiento_manual || item.descripcion || 'Tratamiento'}
                </Text>
                <Text style={styles.smallMeta}>Inicio: {item.fecha_inicio || '-'}</Text>
                <Text style={styles.smallMeta}>Responsable: {item.responsable || '-'}</Text>
                <Text style={styles.smallMeta}>Días transcurridos: {diasTranscurridos(item.fecha_inicio)}</Text>
              </View>
              <View style={styles.rightCol}>
                <StatusBadge estado={item.estado} />
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => navigation.navigate(ROUTES.DETALLE_TRATAMIENTO, { tratamientoId: item.id })}
                >
                  <Text style={styles.linkText}>Ver detalle</Text>
                </TouchableOpacity>
                {item.estado === ESTADOS_TRATAMIENTO.VIGENTE && puedeFinalizar && (
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.navigate(ROUTES.FINALIZAR_TRATAMIENTO, { tratamientoId: item.id })}
                  >
                    <Text style={styles.linkText}>Finalizar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </Card>

      <Card>
        <View style={styles.quickRow}>
          <Ionicons name="medkit-outline" size={20} color={COLORS.primary} />
          <View style={styles.quickTextWrap}>
            <Text style={styles.placeholderTitle}>Flujo completo habilitado</Text>
            <Text style={styles.placeholderSubtitle}>
              Puedes iniciar tratamiento, ver vigentes, abrir detalle, finalizar y consultar historial.
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxxl },
  mainButton: { width: '100%' },
  note: { marginTop: SPACING.sm, marginBottom: SPACING.sm, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  filterChip: {
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: '700' },
  filterTextActive: { color: COLORS.textWhite },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quickTextWrap: { marginLeft: SPACING.sm, flex: 1 },
  placeholderLeft: { flex: 1, paddingRight: SPACING.sm },
  rightCol: { alignItems: 'flex-end', gap: SPACING.xs },
  placeholderTitle: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text },
  placeholderSubtitle: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
  smallMeta: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  linkButton: {
    backgroundColor: COLORS.primaryBackground,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  linkText: { color: COLORS.primary, fontSize: FONTS.sizes.xs, fontWeight: '700' },
  emptyText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
});
