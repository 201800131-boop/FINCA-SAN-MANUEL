import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Card, EmptyState, SectionHeader } from '../../components/UI';
import { RESULTADOS_TRATAMIENTO, ROUTES } from '../../constants';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../../constants/theme';
import { finalizarTratamiento, getTratamientoById } from '../../database/database';

const hoy = () => new Date().toISOString().slice(0, 10);

export const FinalizarTratamientoScreen = ({ navigation, route }) => {
  const { tratamientoId } = route.params;
  const [tratamiento, setTratamiento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fecha_fin_real: hoy(),
    resultado: RESULTADOS_TRATAMIENTO.COMPLETADO,
    observaciones_fin: '',
    recomendacion: '',
  });

  const cargar = useCallback(() => {
    setTratamiento(getTratamientoById(tratamientoId));
  }, [tratamientoId]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  if (!tratamiento) {
    return <EmptyState title="Tratamiento no encontrado" subtitle="No se pudo finalizar este tratamiento." />;
  }

  const guardar = () => {
    if (!form.fecha_fin_real) {
      Alert.alert('Dato requerido', 'Ingresa la fecha de finalización.');
      return;
    }

    const estado = form.resultado === RESULTADOS_TRATAMIENTO.SUSPENDIDO ? 'Suspendido' : 'Finalizado';
    const observaciones = [form.observaciones_fin, form.recomendacion ? `Recomendación: ${form.recomendacion}` : '']
      .filter(Boolean)
      .join('\n');

    setLoading(true);
    try {
      finalizarTratamiento(tratamientoId, {
        estado,
        resultado: form.resultado,
        fecha_fin_real: form.fecha_fin_real,
        observaciones_fin: observaciones,
      });
      Alert.alert('Finalización guardada', 'El tratamiento se movió a historial.', [
        { text: 'Aceptar', onPress: () => navigation.navigate(ROUTES.TRATAMIENTOS_HOME) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.title}>{tratamiento.vaca_nombre || tratamiento.vaca_codigo}</Text>
          <Text style={styles.subtitle}>{tratamiento.tratamiento_manual || tratamiento.descripcion || 'Tratamiento'}</Text>
        </Card>

        <SectionHeader title="Finalizar tratamiento" />
        <Card>
          <Input
            label="Fecha de finalización"
            value={form.fecha_fin_real}
            onChangeText={(value) => setForm((prev) => ({ ...prev, fecha_fin_real: value }))}
            placeholder="AAAA-MM-DD"
            required
          />
          <Select
            label="Resultado"
            value={form.resultado}
            onValueChange={(value) => setForm((prev) => ({ ...prev, resultado: value }))}
            options={Object.values(RESULTADOS_TRATAMIENTO)}
            required
          />
          <Input
            label="Observaciones finales"
            value={form.observaciones_fin}
            onChangeText={(value) => setForm((prev) => ({ ...prev, observaciones_fin: value }))}
            multiline
            numberOfLines={3}
          />
          <Input
            label="Recomendación o seguimiento"
            value={form.recomendacion}
            onChangeText={(value) => setForm((prev) => ({ ...prev, recomendacion: value }))}
            multiline
            numberOfLines={3}
          />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Guardar finalización" onPress={guardar} loading={loading} style={styles.btn} />
        <Button title="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={styles.btn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 140 },
  title: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text },
  subtitle: { marginTop: 4, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    ...SHADOWS.large,
  },
  btn: { width: '100%', marginBottom: SPACING.sm },
});
