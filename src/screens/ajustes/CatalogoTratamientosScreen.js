import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { Card } from '../../components/UI';
import { Input } from '../../components/Input';
import { ROUTES } from '../../constants';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { getCatalogos, toggleCatalogoActivo } from '../../database/database';

export const CatalogoTratamientosScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  const cargar = useCallback(() => {
    setItems(getCatalogos(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const filtered = useMemo(
    () => items.filter((i) => i.nombre.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Input
          label="Buscar"
          value={search}
          onChangeText={setSearch}
          placeholder="Nombre del tratamiento"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.title}>{item.nombre}</Text>
            <Text style={styles.meta}>{item.descripcion || 'Sin descripción'}</Text>
            <Text style={styles.meta}>Medicamento: {item.medicamento_base || '-'}</Text>
            <Text style={styles.meta}>Dosis sugerida: {item.dosis_sugerida || '-'}</Text>
            <Text style={styles.meta}>Duración sugerida: {item.duracion_sugerida || '-'}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate(ROUTES.CREAR_CATALOGO, { catalogoId: item.id })}>
                <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => toggleCatalogoActivo(item.id, !item.activo) || cargar()}>
                <Ionicons name={item.activo ? 'pause-outline' : 'play-outline'} size={16} color={COLORS.primary} />
                <Text style={styles.actionText}>{item.activo ? 'Desactivar' : 'Activar'}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
      <Button title="Crear tratamiento" onPress={() => navigation.navigate(ROUTES.CREAR_CATALOGO)} style={styles.footerBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  top: { paddingHorizontal: SPACING.md, paddingTop: SPACING.md },
  list: { padding: SPACING.md, paddingBottom: 100 },
  title: { fontSize: FONTS.sizes.md, fontWeight: '800', color: COLORS.text },
  meta: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
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
  footerBtn: { width: '94%', alignSelf: 'center', marginBottom: SPACING.md },
});
