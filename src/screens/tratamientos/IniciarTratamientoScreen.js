import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Card, SectionHeader } from '../../components/UI';
import {
  ESTADOS_TRATAMIENTO,
  FRECUENCIAS,
  ROUTES,
  VIAS_ADMINISTRACION,
} from '../../constants';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../../constants/theme';
import {
  crearTratamiento,
  existeTratamientoVigenteSimilar,
  getCatalogos,
  getVacas,
} from '../../database/database';
import { useAuth } from '../../context/AuthContext';

const MODOS = {
  CATALOGO: 'catalogo',
  MANUAL: 'manual',
};

const hoy = () => new Date().toISOString().slice(0, 10);

export const IniciarTratamientoScreen = ({ navigation }) => {
  const { usuario, tienePermiso } = useAuth();
  const [modo, setModo] = useState(MODOS.CATALOGO);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vaca_id: null,
    tratamiento_catalogo_id: null,
    tratamiento_manual: '',
    descripcion: '',
    motivo: '',
    medicamento: '',
    dosis: '',
    via_administracion: '',
    frecuencia: '',
    fecha_inicio: hoy(),
    fecha_fin_estimada: '',
    responsable: usuario?.nombre || '',
    observaciones_inicio: '',
    estado: ESTADOS_TRATAMIENTO.VIGENTE,
  });

  const vacas = useMemo(
    () => getVacas().map((v) => ({ label: `${v.nombre} (${v.codigo})`, value: v.id })),
    []
  );

  const catalogos = useMemo(
    () => getCatalogos(true).map((c) => ({ label: c.nombre, value: c.id, meta: c })),
    []
  );

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const applyCatalogo = (catalogoId) => {
    update('tratamiento_catalogo_id', catalogoId);
    const selected = catalogos.find((c) => c.value === catalogoId);
    if (!selected) {
      return;
    }
    const meta = selected.meta;
    setForm((prev) => ({
      ...prev,
      tratamiento_catalogo_id: catalogoId,
      descripcion: meta.descripcion || prev.descripcion,
      medicamento: meta.medicamento_base || prev.medicamento,
      dosis: meta.dosis_sugerida || prev.dosis,
      via_administracion: meta.via_administracion || prev.via_administracion,
      frecuencia: meta.frecuencia || prev.frecuencia,
    }));
  };

  const validate = () => {
    const next = {};
    if (!form.vaca_id) next.vaca_id = 'Selecciona una vaca';
    if (!form.fecha_inicio) next.fecha_inicio = 'Ingresa fecha de inicio';

    const nombreTratamiento = modo === MODOS.MANUAL
      ? (form.tratamiento_manual || '').trim()
      : (catalogos.find((c) => c.value === form.tratamiento_catalogo_id)?.label || '').trim();

    if (modo === MODOS.MANUAL && !nombreTratamiento) {
      next.tratamiento_manual = 'Ingresa nombre del tratamiento';
    }
    if (modo === MODOS.CATALOGO && !form.tratamiento_catalogo_id) {
      next.tratamiento_catalogo_id = 'Selecciona un tratamiento del catálogo';
    }
    if (form.vaca_id && nombreTratamiento && existeTratamientoVigenteSimilar(form.vaca_id, nombreTratamiento)) {
      next.tratamiento_manual = 'Ya existe un tratamiento igual vigente para esta vaca';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const guardar = (accion) => {
    if (!tienePermiso('puede_iniciar_tratamientos')) {
      Alert.alert('Acceso restringido', 'Tu usuario no tiene permiso para iniciar tratamientos.');
      navigation.goBack();
      return;
    }
    if (!validate()) {
      return;
    }

    const payload = {
      ...form,
      tratamiento_catalogo_id: modo === MODOS.CATALOGO ? form.tratamiento_catalogo_id : null,
      tratamiento_manual: modo === MODOS.MANUAL ? form.tratamiento_manual.trim() : null,
      creado_por: usuario?.id || null,
    };

    setLoading(true);
    try {
      crearTratamiento(payload);
      if (accion === 'guardar_otro') {
        setForm((prev) => ({
          ...prev,
          tratamiento_catalogo_id: null,
          tratamiento_manual: '',
          descripcion: '',
          motivo: '',
          medicamento: '',
          dosis: '',
          via_administracion: '',
          frecuencia: '',
          fecha_fin_estimada: '',
          observaciones_inicio: '',
        }));
        Alert.alert('Guardado', 'Tratamiento guardado. Puedes iniciar otro.');
      } else {
        Alert.alert('Guardado', 'Tratamiento iniciado correctamente.', [
          { text: 'Aceptar', onPress: () => navigation.navigate(ROUTES.TRATAMIENTOS_HOME) },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader title="Datos principales" />
        <Card>
          <Select
            label="Vaca seleccionada"
            value={form.vaca_id}
            onValueChange={(value) => update('vaca_id', value)}
            options={vacas}
            placeholder="Selecciona una vaca"
            buscable
            error={errors.vaca_id}
            required
          />
          <Select
            label="Modo de registro"
            value={modo}
            onValueChange={(value) => setModo(value)}
            options={[
              { label: 'Seleccionar de catálogo', value: MODOS.CATALOGO },
              { label: 'Tratamiento manual', value: MODOS.MANUAL },
            ]}
          />

          {modo === MODOS.CATALOGO ? (
            <Select
              label="Tratamiento"
              value={form.tratamiento_catalogo_id}
              onValueChange={applyCatalogo}
              options={catalogos}
              placeholder="Selecciona tratamiento existente"
              buscable
              error={errors.tratamiento_catalogo_id}
              required
            />
          ) : (
            <Input
              label="Tratamiento manual"
              value={form.tratamiento_manual}
              onChangeText={(value) => update('tratamiento_manual', value)}
              placeholder="Nombre o tipo de tratamiento"
              error={errors.tratamiento_manual}
              required
            />
          )}

          <Input label="Descripción" value={form.descripcion} onChangeText={(value) => update('descripcion', value)} />
          <Input label="Motivo" value={form.motivo} onChangeText={(value) => update('motivo', value)} />
          <Input label="Medicamento o producto" value={form.medicamento} onChangeText={(value) => update('medicamento', value)} />
          <Input label="Dosis" value={form.dosis} onChangeText={(value) => update('dosis', value)} />
          <Select
            label="Vía de administración"
            value={form.via_administracion}
            onValueChange={(value) => update('via_administracion', value)}
            options={VIAS_ADMINISTRACION}
            placeholder="Selecciona vía"
          />
          <Select
            label="Frecuencia"
            value={form.frecuencia}
            onValueChange={(value) => update('frecuencia', value)}
            options={FRECUENCIAS}
            placeholder="Selecciona frecuencia"
          />
          <Input
            label="Fecha de inicio"
            value={form.fecha_inicio}
            onChangeText={(value) => update('fecha_inicio', value)}
            placeholder="AAAA-MM-DD"
            error={errors.fecha_inicio}
            required
          />
          <Input
            label="Fecha estimada de finalización"
            value={form.fecha_fin_estimada}
            onChangeText={(value) => update('fecha_fin_estimada', value)}
            placeholder="AAAA-MM-DD"
          />
          <Input label="Responsable" value={form.responsable} onChangeText={(value) => update('responsable', value)} />
          <Input
            label="Observaciones"
            value={form.observaciones_inicio}
            onChangeText={(value) => update('observaciones_inicio', value)}
            multiline
            numberOfLines={3}
          />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Guardar tratamiento" onPress={() => guardar('guardar')} loading={loading} style={styles.btn} />
        <Button title="Guardar e iniciar otro" variant="secondary" onPress={() => guardar('guardar_otro')} loading={loading} style={styles.btn} />
        <Button title="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={styles.btn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 160 },
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
