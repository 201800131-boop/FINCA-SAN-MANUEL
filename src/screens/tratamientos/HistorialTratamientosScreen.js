import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, SectionHeader, StatusBadge } from '../../components/UI';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { ESTADOS_TRATAMIENTO } from '../../constants';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { getTratamientos, getVacas } from '../../database/database';

export const HistorialTratamientosScreen = () => {
  const [filtros, setFiltros] = useState({
    vaca_id: null,
    estado: null,
    responsable: '',
    tipo: '',
    fecha: '',
  });

  const vacas = useMemo(
    () => [{ label: 'Todas', value: null }, ...getVacas().map((v) => ({ label: `${v.nombre} (${v.codigo})`, value: v.id }))],
    []
  );

  const data = useMemo(() => {
    const base = getTratamientos({
      vaca_id: filtros.vaca_id || undefined,
      estado: filtros.estado || undefined,
      responsable: filtros.responsable || undefined,
      busqueda: filtros.tipo || undefined,
    });
    if (!filtros.fecha) {
      return base;
    }
    return base.filter((item) =>
      String(item.fecha_inicio || '').includes(filtros.fecha) || String(item.fecha_fin_real || '').includes(filtros.fecha)
    );
  }, [filtros]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader title="Filtros" />
      <Card>
        <Select
          label="Por vaca"
          value={filtros.vaca_id}
          onValueChange={(value) => setFiltros((prev) => ({ ...prev, vaca_id: value || null }))}
          options={vacas}
          buscable
        />
        <Input
          label="Por fecha"
          value={filtros.fecha}
          onChangeText={(value) => setFiltros((prev) => ({ ...prev, fecha: value }))}
          placeholder="AAAA-MM o AAAA-MM-DD"
        />
        <Input
          label="Por tipo de tratamiento"
          value={filtros.tipo}
          onChangeText={(value) => setFiltros((prev) => ({ ...prev, tipo: value }))}
          placeholder="Texto de tratamiento"
        />
        <Select
          label="Por estado"
          value={filtros.estado}
          onValueChange={(value) => setFiltros((prev) => ({ ...prev, estado: value || null }))}
          options={[
            { label: 'Todos', value: null },
            ESTADOS_TRATAMIENTO.VIGENTE,
            ESTADOS_TRATAMIENTO.FINALIZADO,
            ESTADOS_TRATAMIENTO.SUSPENDIDO,
          ]}
        />
        <Input
          label="Por responsable"
          value={filtros.responsable}
          onChangeText={(value) => setFiltros((prev) => ({ ...prev, responsable: value }))}
          placeholder="Nombre del responsable"
        />
      </Card>

      <SectionHeader title="Resultados" />
      <Card>
        {data.length === 0 ? (
          <Text style={styles.empty}>No hay tratamientos para los filtros seleccionados.</Text>
        ) : (
          data.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.title}>{item.vaca_nombre || item.vaca_codigo}</Text>
                <Text style={styles.subtitle}>{item.tratamiento_manual || item.descripcion || 'Tratamiento'}</Text>
                <Text style={styles.meta}>Inicio: {item.fecha_inicio || '-'}</Text>
                <Text style={styles.meta}>Fin: {item.fecha_fin_real || '-'}</Text>
                <Text style={styles.meta}>Responsable: {item.responsable || '-'}</Text>
              </View>
              <StatusBadge estado={item.estado} />
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxxl },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  left: { flex: 1, paddingRight: SPACING.sm },
  title: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  empty: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
});