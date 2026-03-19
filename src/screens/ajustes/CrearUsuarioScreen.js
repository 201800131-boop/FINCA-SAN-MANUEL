import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { ROLES, ROUTES } from '../../constants';
import { BORDER_RADIUS, COLORS, SHADOWS, SPACING } from '../../constants/theme';
import { crearUsuario, getUsuarios } from '../../database/database';

export const CrearUsuarioScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre: '', usuario: '', contrasena: '', rol: ROLES.EMPLEADO, activo: 1 });

  const existentes = useMemo(() => getUsuarios().map((u) => u.usuario.toLowerCase()), []);

  const guardar = () => {
    if (!form.nombre.trim() || !form.usuario.trim() || !form.contrasena.trim()) {
      Alert.alert('Campos requeridos', 'Completa nombre, usuario y contraseña.');
      return;
    }
    if (existentes.includes(form.usuario.trim().toLowerCase())) {
      Alert.alert('Usuario duplicado', 'Ese nombre de usuario ya existe.');
      return;
    }

    setLoading(true);
    try {
      crearUsuario({
        nombre: form.nombre.trim(),
        usuario: form.usuario.trim(),
        contrasena: form.contrasena,
        rol: form.rol,
        activo: form.activo,
      });
      Alert.alert('Usuario creado', 'El usuario fue registrado correctamente.', [
        { text: 'Aceptar', onPress: () => navigation.navigate(ROUTES.USUARIOS) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Nombre completo" value={form.nombre} onChangeText={(value) => setForm((prev) => ({ ...prev, nombre: value }))} required />
        <Input label="Usuario" value={form.usuario} onChangeText={(value) => setForm((prev) => ({ ...prev, usuario: value }))} autoCapitalize="none" required />
        <Input label="Contraseña" value={form.contrasena} onChangeText={(value) => setForm((prev) => ({ ...prev, contrasena: value }))} secureTextEntry required />
        <Select label="Rol" value={form.rol} onValueChange={(value) => setForm((prev) => ({ ...prev, rol: value }))} options={Object.values(ROLES)} />
        <Select
          label="Estado"
          value={form.activo}
          onValueChange={(value) => setForm((prev) => ({ ...prev, activo: value }))}
          options={[{ label: 'Activo', value: 1 }, { label: 'Inactivo', value: 0 }]}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Guardar usuario" onPress={guardar} loading={loading} style={styles.btn} />
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
