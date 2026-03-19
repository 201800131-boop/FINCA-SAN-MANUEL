import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Card, EmptyState, InfoRow, SectionHeader, StatusBadge } from '../../components/UI';
import { ESTADOS_TRATAMIENTO, ROUTES } from '../../constants';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { getTratamientoById } from '../../database/database';

export const DetalleTratamientoScreen = ({ navigation, route }) => {
  const { tratamientoId } = route.params;
  const [tratamiento, setTratamiento] = useState(null);

  const cargar = useCallback(() => {
    setTratamiento(getTratamientoById(tratamientoId));
  }, [tratamientoId]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  if (!tratamiento) {
    return <EmptyState title="Tratamiento no encontrado" subtitle="No fue posible cargar el tratamiento." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.title}>{tratamiento.vaca_nombre || tratamiento.vaca_codigo}</Text>
        <Text style={styles.subtitle}>{tratamiento.tratamiento_manual || tratamiento.descripcion || 'Tratamiento'}</Text>
        <StatusBadge estado={tratamiento.estado} style={styles.badge} />
      </Card>

      <SectionHeader title="Datos del tratamiento" />
      <Card>
        <InfoRow label="Motivo" value={tratamiento.motivo} />
        <InfoRow label="Medicamento" value={tratamiento.medicamento} />
        <InfoRow label="Dosis" value={tratamiento.dosis} />
        <InfoRow label="Vía" value={tratamiento.via_administracion} />
        <InfoRow label="Frecuencia" value={tratamiento.frecuencia} />
        <InfoRow label="Fecha de inicio" value={tratamiento.fecha_inicio} />
        <InfoRow label="Fecha fin estimada" value={tratamiento.fecha_fin_estimada} />
        <InfoRow label="Fecha fin real" value={tratamiento.fecha_fin_real} />
        <InfoRow label="Responsable" value={tratamiento.responsable} />
        <InfoRow label="Resultado" value={tratamiento.resultado} />
      </Card>

      <SectionHeader title="Observaciones" />
      <Card>
        <Text style={styles.text}>{tratamiento.observaciones_inicio || 'Sin observaciones iniciales.'}</Text>
        <Text style={styles.text}>{tratamiento.observaciones_fin || 'Sin observaciones finales.'}</Text>
      </Card>

      {tratamiento.estado === ESTADOS_TRATAMIENTO.VIGENTE && (
        <Button
          title="Finalizar tratamiento"
          onPress={() => navigation.navigate(ROUTES.FINALIZAR_TRATAMIENTO, { tratamientoId })}
          style={styles.action}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxxl },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text },
  subtitle: { marginTop: 4, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  badge: { marginTop: SPACING.sm },
  text: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.sm },
  action: { width: '100%' },
});
