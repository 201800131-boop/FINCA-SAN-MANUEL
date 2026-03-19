import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { FRECUENCIAS, ROUTES, VIAS_ADMINISTRACION } from '../../constants';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '../../constants/theme';
import { actualizarCatalogo, crearCatalogo, getCatalogoById } from '../../database/database';

export const CrearCatalogoScreen = ({ navigation, route }) => {
  const catalogoId = route.params?.catalogoId;
  const original = catalogoId ? getCatalogoById(catalogoId) : null;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: original?.nombre || '',
    descripcion: original?.descripcion || '',
    medicamento_base: original?.medicamento_base || '',
    dosis_sugerida: original?.dosis_sugerida || '',
    via_administracion: original?.via_administracion || '',
    frecuencia: original?.frecuencia || '',
    duracion_sugerida: original?.duracion_sugerida || '',
    observaciones: original?.observaciones || '',
  });

  const guardar = () => {
    if (!form.nombre.trim()) {
      Alert.alert('Campo requerido', 'Ingresa el nombre del tratamiento.');
      return;
    }

    setLoading(true);
    try {
      if (catalogoId) {
        actualizarCatalogo(catalogoId, form);
      } else {
        crearCatalogo(form);
      }
      Alert.alert('Guardado', 'Catálogo guardado correctamente.', [
        { text: 'Aceptar', onPress: () => navigation.navigate(ROUTES.CATALOGO_TRATAMIENTOS) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Nombre del tratamiento" value={form.nombre} onChangeText={(value) => setForm((prev) => ({ ...prev, nombre: value }))} required />
        <Input label="Descripción" value={form.descripcion} onChangeText={(value) => setForm((prev) => ({ ...prev, descripcion: value }))} multiline numberOfLines={3} />
        <Input label="Medicamento habitual" value={form.medicamento_base} onChangeText={(value) => setForm((prev) => ({ ...prev, medicamento_base: value }))} />
        <Input label="Dosis sugerida" value={form.dosis_sugerida} onChangeText={(value) => setForm((prev) => ({ ...prev, dosis_sugerida: value }))} />
        <Select label="Vía sugerida" value={form.via_administracion} onValueChange={(value) => setForm((prev) => ({ ...prev, via_administracion: value }))} options={VIAS_ADMINISTRACION} />
        <Select label="Frecuencia" value={form.frecuencia} onValueChange={(value) => setForm((prev) => ({ ...prev, frecuencia: value }))} options={FRECUENCIAS} />
        <Input label="Duración sugerida" value={form.duracion_sugerida} onChangeText={(value) => setForm((prev) => ({ ...prev, duracion_sugerida: value }))} />
        <Input label="Observaciones" value={form.observaciones} onChangeText={(value) => setForm((prev) => ({ ...prev, observaciones: value }))} multiline numberOfLines={3} />
      </ScrollView>
      <View style={styles.footer}>
        <Button title={catalogoId ? 'Guardar cambios' : 'Crear tratamiento'} onPress={guardar} loading={loading} style={styles.btn} />
        <Button title="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={styles.btn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 140 },
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
