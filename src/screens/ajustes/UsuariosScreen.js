import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { Card, EmptyState, StatusBadge } from '../../components/UI';
import { ROUTES } from '../../constants';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { cambiarContrasena, getUsuarios, toggleUsuarioActivo } from '../../database/database';
import { useAuth } from '../../context/AuthContext';

export const UsuariosScreen = ({ navigation }) => {
  const { esAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState([]);

  const cargar = useCallback(() => {
    setUsuarios(getUsuarios());
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  if (!esAdmin()) {
    return (
      <EmptyState
        icon="shield-outline"
        title="Acceso restringido"
        subtitle="Solo el administrador puede gestionar usuarios."
      />
    );
  }

  const resetPassword = (id) => {
    Alert.alert('Restablecer contraseña', 'La contraseña quedará en 123456. ¿Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Restablecer',
        onPress: () => {
          cambiarContrasena(id, '123456');
          Alert.alert('Listo', 'Contraseña restablecida a 123456');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.rowTop}>
              <View style={styles.left}>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.meta}>Usuario: {item.usuario}</Text>
                <Text style={styles.meta}>Rol: {item.rol}</Text>
              </View>
              <StatusBadge estado={item.activo ? 'Activa' : 'Fallecida'} />
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate(ROUTES.EDITAR_USUARIO, { usuarioId: item.id })}>
                <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => toggleUsuarioActivo(item.id, !item.activo) || cargar()}>
                <Ionicons name={item.activo ? 'pause-outline' : 'play-outline'} size={16} color={COLORS.primary} />
                <Text style={styles.actionText}>{item.activo ? 'Desactivar' : 'Activar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => resetPassword(item.id)}>
                <Ionicons name="key-outline" size={16} color={COLORS.primary} />
                <Text style={styles.actionText}>Restablecer clave</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
      <Button title="Crear usuario" onPress={() => navigation.navigate(ROUTES.CREAR_USUARIO)} style={styles.fabLike} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, paddingBottom: 100 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  left: { flex: 1, paddingRight: SPACING.sm },
  name: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text },
  meta: { marginTop: 2, fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 999,
  },
  actionText: { marginLeft: 4, color: COLORS.primary, fontSize: FONTS.sizes.xs, fontWeight: '700' },
  fabLike: { width: '94%', alignSelf: 'center', marginBottom: SPACING.md },
});
