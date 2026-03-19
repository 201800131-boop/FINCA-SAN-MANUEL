import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Card, SectionHeader } from '../../components/UI';
import {
  ESTADOS_VACA,
  ESTADO_REPRODUCTIVO,
  RAZAS,
  SEXO,
} from '../../constants';
import { BORDER_RADIUS, COLORS, FONTS, SHADOWS, SPACING } from '../../constants/theme';
import { existeAreteVaca, existeCodigoVaca } from '../../database/database';

const buildInitialForm = (values = {}) => ({
  codigo: values.codigo || '',
  nombre: values.nombre || '',
  numero_arete: values.numero_arete || '',
  raza: values.raza || '',
  sexo: values.sexo || SEXO.HEMBRA,
  fecha_nacimiento: values.fecha_nacimiento || '',
  edad_aproximada: values.edad_aproximada || '',
  estado: values.estado || ESTADOS_VACA.ACTIVA,
  produccion_leche_dia: values.produccion_leche_dia != null ? String(values.produccion_leche_dia) : '',
  fecha_ingreso: values.fecha_ingreso || '',
  procedencia: values.procedencia || '',
  observaciones: values.observaciones || '',
  estado_salud: values.estado_salud || '',
  ultima_revision: values.ultima_revision || '',
  alergias_notas: values.alergias_notas || '',
  numero_partos: values.numero_partos != null ? String(values.numero_partos) : '',
  ultimo_parto: values.ultimo_parto || '',
  estado_reproductivo: values.estado_reproductivo || '',
});

export const VacaForm = ({
  mode = 'create',
  initialValues,
  recordId = null,
  onSubmit,
}) => {
  const navigation = useNavigation();
  const [form, setForm] = useState(buildInitialForm(initialValues));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const skipLeaveGuardRef = useRef(false);
  const initialSnapshotRef = useRef(JSON.stringify(buildInitialForm(initialValues)));

  useEffect(() => {
    const next = buildInitialForm(initialValues);
    setForm(next);
    initialSnapshotRef.current = JSON.stringify(next);
  }, [initialValues]);

  const dirty = useMemo(
    () => JSON.stringify(form) !== initialSnapshotRef.current,
    [form]
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (skipLeaveGuardRef.current || !dirty) {
        return;
      }

      event.preventDefault();
      Alert.alert(
        'Cambios sin guardar',
        'Tienes cambios sin guardar. ¿Deseas salir de todos modos?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          {
            text: 'Salir sin guardar',
            style: 'destructive',
            onPress: () => {
              skipLeaveGuardRef.current = true;
              navigation.dispatch(event.data.action);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [dirty, navigation]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: null }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    const effectiveCodigo = (form.codigo || '').trim() || (form.numero_arete || '').trim();
    const trimmedArete = (form.numero_arete || '').trim();

    if (!effectiveCodigo) {
      nextErrors.codigo = 'Ingresa código interno o número de arete';
    }
    if (!(form.nombre || '').trim()) {
      nextErrors.nombre = 'Ingresa nombre o identificación';
    }
    if (!form.raza) {
      nextErrors.raza = 'Selecciona la raza';
    }
    if (!form.estado) {
      nextErrors.estado = 'Selecciona el estado actual';
    }

    if (effectiveCodigo && existeCodigoVaca(effectiveCodigo, recordId)) {
      nextErrors.codigo = 'Ese código ya está registrado';
    }
    if (trimmedArete && existeAreteVaca(trimmedArete, recordId)) {
      nextErrors.numero_arete = 'Ese número de arete ya está registrado';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const getPayload = () => ({
    codigo: (form.codigo || '').trim() || (form.numero_arete || '').trim(),
    nombre: (form.nombre || '').trim(),
    numero_arete: (form.numero_arete || '').trim(),
    raza: form.raza,
    sexo: form.sexo,
    fecha_nacimiento: (form.fecha_nacimiento || '').trim(),
    edad_aproximada: (form.edad_aproximada || '').trim(),
    estado: form.estado,
    produccion_leche_dia: form.produccion_leche_dia ? Number(form.produccion_leche_dia) : 0,
    fecha_ingreso: (form.fecha_ingreso || '').trim(),
    procedencia: (form.procedencia || '').trim(),
    observaciones: (form.observaciones || '').trim(),
    estado_salud: (form.estado_salud || '').trim(),
    ultima_revision: (form.ultima_revision || '').trim(),
    alergias_notas: (form.alergias_notas || '').trim(),
    numero_partos: form.numero_partos ? Number(form.numero_partos) : 0,
    ultimo_parto: (form.ultimo_parto || '').trim(),
    estado_reproductivo: form.estado_reproductivo,
  });

  const submit = async (action) => {
    if (!validate()) {
      return;
    }

    const payload = getPayload();
    try {
      setSubmitting(true);
      await onSubmit(payload, action, {
        markSaved: () => {
          const snapshot = buildInitialForm(payload);
          setForm(snapshot);
          initialSnapshotRef.current = JSON.stringify(snapshot);
        },
        clearForm: () => {
          const snapshot = buildInitialForm();
          setForm(snapshot);
          setErrors({});
          initialSnapshotRef.current = JSON.stringify(snapshot);
        },
        allowExit: () => {
          skipLeaveGuardRef.current = true;
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (!dirty) {
      navigation.goBack();
      return;
    }

    Alert.alert(
      'Salir sin guardar',
      'Hay información escrita. ¿Deseas volver sin guardar?',
      [
        { text: 'Seguir aquí', style: 'cancel' },
        {
          text: 'Volver',
          style: 'destructive',
          onPress: () => {
            skipLeaveGuardRef.current = true;
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Identificación" />
        <Card>
          <Input
            label="Código interno"
            value={form.codigo}
            onChangeText={(value) => updateField('codigo', value)}
            placeholder="Ejemplo: V-001"
            error={errors.codigo}
            helper="Si no ingresas código, se usará el número de arete como identificación interna"
          />
          <Input
            label="Nombre o apodo"
            value={form.nombre}
            onChangeText={(value) => updateField('nombre', value)}
            placeholder="Nombre o identificación de la vaca"
            error={errors.nombre}
            required
          />
          <Input
            label="Número de arete"
            value={form.numero_arete}
            onChangeText={(value) => updateField('numero_arete', value)}
            placeholder="Número de arete"
            error={errors.numero_arete}
          />
          <Select
            label="Raza"
            value={form.raza}
            onValueChange={(value) => updateField('raza', value)}
            options={RAZAS}
            placeholder="Selecciona la raza"
            error={errors.raza}
            buscable
            required
          />
          <Select
            label="Sexo"
            value={form.sexo}
            onValueChange={(value) => updateField('sexo', value)}
            options={Object.values(SEXO)}
            placeholder="Selecciona el sexo"
          />
          <Select
            label="Estado actual"
            value={form.estado}
            onValueChange={(value) => updateField('estado', value)}
            options={Object.values(ESTADOS_VACA)}
            placeholder="Selecciona el estado"
            error={errors.estado}
            required
          />
        </Card>

        <SectionHeader title="Datos generales" />
        <Card>
          <Input
            label="Fecha de nacimiento"
            value={form.fecha_nacimiento}
            onChangeText={(value) => updateField('fecha_nacimiento', value)}
            placeholder="AAAA-MM-DD"
          />
          <Input
            label="Edad aproximada"
            value={form.edad_aproximada}
            onChangeText={(value) => updateField('edad_aproximada', value)}
            placeholder="Ejemplo: 4 años"
          />
          <Input
            label="Fecha de ingreso a la finca"
            value={form.fecha_ingreso}
            onChangeText={(value) => updateField('fecha_ingreso', value)}
            placeholder="AAAA-MM-DD"
          />
          <Input
            label="Procedencia"
            value={form.procedencia}
            onChangeText={(value) => updateField('procedencia', value)}
            placeholder="Origen o proveedor"
          />
        </Card>

        <SectionHeader title="Datos productivos" />
        <Card>
          <Input
            label="Producción promedio de leche por día"
            value={form.produccion_leche_dia}
            onChangeText={(value) => updateField('produccion_leche_dia', value)}
            placeholder="Litros por día"
            keyboardType="numeric"
          />
        </Card>

        <SectionHeader title="Datos sanitarios" />
        <Card>
          <Input
            label="Estado de salud"
            value={form.estado_salud}
            onChangeText={(value) => updateField('estado_salud', value)}
            placeholder="Estado general de salud"
          />
          <Input
            label="Última revisión"
            value={form.ultima_revision}
            onChangeText={(value) => updateField('ultima_revision', value)}
            placeholder="AAAA-MM-DD"
          />
          <Input
            label="Alergias o notas importantes"
            value={form.alergias_notas}
            onChangeText={(value) => updateField('alergias_notas', value)}
            placeholder="Alergias, cuidados o alertas"
            multiline
            numberOfLines={3}
          />
        </Card>

        <SectionHeader title="Datos reproductivos opcionales" />
        <Card>
          <Input
            label="Número de partos"
            value={form.numero_partos}
            onChangeText={(value) => updateField('numero_partos', value)}
            placeholder="Cantidad de partos"
            keyboardType="numeric"
          />
          <Input
            label="Último parto"
            value={form.ultimo_parto}
            onChangeText={(value) => updateField('ultimo_parto', value)}
            placeholder="AAAA-MM-DD"
          />
          <Select
            label="Estado reproductivo"
            value={form.estado_reproductivo}
            onValueChange={(value) => updateField('estado_reproductivo', value)}
            options={ESTADO_REPRODUCTIVO}
            placeholder="Selecciona el estado reproductivo"
          />
        </Card>

        <SectionHeader title="Observaciones" />
        <Card>
          <Input
            label="Observaciones generales"
            value={form.observaciones}
            onChangeText={(value) => updateField('observaciones', value)}
            placeholder="Notas adicionales de la vaca"
            multiline
            numberOfLines={4}
          />
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        {mode === 'create' ? (
          <>
            <Button title="Volver" variant="outline" onPress={handleBack} style={styles.footerButton} />
            <Button
              title="Guardar registro"
              onPress={() => submit('save')}
              loading={submitting}
              style={styles.footerButton}
            />
            <Button
              title="Guardar y seguir"
              variant="secondary"
              onPress={() => submit('save_and_continue')}
              loading={submitting}
              style={styles.footerButton}
            />
          </>
        ) : (
          <>
            <Button title="Cancelar" variant="outline" onPress={handleBack} style={styles.editButton} />
            <Button
              title="Guardar cambios"
              onPress={() => submit('save_changes')}
              loading={submitting}
              style={styles.editButton}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 140,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.large,
  },
  footerButton: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  editButton: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
});