import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card, SectionHeader } from '../../components/UI';
import { COLORS, SPACING } from '../../constants/theme';

export const ConfiguracionFincaScreen = () => {
  const [form, setForm] = useState({
    nombre_finca: 'Finca San Manuel',
    logo: 'No configurado',
    notas: '',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader title="Datos generales de la finca" />
      <Card>
        <Input label="Nombre de la finca" value={form.nombre_finca} onChangeText={(value) => setForm((prev) => ({ ...prev, nombre_finca: value }))} />
        <Input label="Logo" value={form.logo} onChangeText={(value) => setForm((prev) => ({ ...prev, logo: value }))} helper="Ruta o referencia de logo para configuración futura." />
        <Input label="Notas de configuración" value={form.notas} onChangeText={(value) => setForm((prev) => ({ ...prev, notas: value }))} multiline numberOfLines={4} />
        <Button title="Guardar configuración" onPress={() => Alert.alert('Guardado', 'Configuración básica actualizada.')} />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxxl },
});