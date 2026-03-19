import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card, EmptyState, SectionHeader } from '../../components/UI';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { actualizarPermisos, getRolesPermisos } from '../../database/database';
import { useAuth } from '../../context/AuthContext';

const permissionFields = [
  ['puede_ver_vacas', 'Ver vacas'],
  ['puede_registrar_vacas', 'Registrar vacas'],
  ['puede_editar_vacas', 'Editar vacas'],
  ['puede_iniciar_tratamientos', 'Iniciar tratamientos'],
  ['puede_finalizar_tratamientos', 'Finalizar tratamientos'],
  ['puede_ver_ajustes', 'Ver ajustes'],
  ['puede_administrar_usuarios', 'Administrar usuarios'],
];

export const PermisosScreen = () => {
  const { esAdmin } = useAuth();
  const [roles, setRoles] = useState(getRolesPermisos());

  if (!esAdmin()) {
    return <EmptyState title="Acceso restringido" subtitle="Solo admin puede cambiar permisos." />;
  }

  const toggle = (role, key) => {
    setRoles((prev) => prev.map((r) => (r.rol === role ? { ...r, [key]: r[key] ? 0 : 1 } : r)));
  };

  const guardar = (rol) => {
    const data = roles.find((r) => r.rol === rol);
    if (!data) return;
    actualizarPermisos(rol, data);
    Alert.alert('Permisos guardados', `Se actualizaron permisos para ${rol}.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {roles.map((rol) => (
        <Card key={rol.rol}>
          <SectionHeader title={`Rol: ${rol.rol}`} />
          {permissionFields.map(([key, label]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Switch value={Boolean(rol[key])} onValueChange={() => toggle(rol.rol, key)} />
            </View>
          ))}
          <Button title="Guardar permisos" onPress={() => guardar(rol.rol)} style={styles.btn} />
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxxl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  label: { fontSize: FONTS.sizes.sm, color: COLORS.text },
  btn: { width: '100%', marginTop: SPACING.md },
});
