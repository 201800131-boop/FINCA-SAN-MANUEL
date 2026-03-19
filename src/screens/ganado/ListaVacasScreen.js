import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { ROUTES, ESTADOS_VACA, RAZAS } from '../../constants';
import { getVacas } from '../../database/database';
import { StatusBadge, EmptyState } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { Select } from '../../components/Select';

const VacaCard = ({ vaca, onPress, onEdit, canEdit }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={styles.cardHeader}>
      <View style={styles.cardAvatar}>
        <Ionicons name="ellipse" size={28} color={COLORS.secondary} />
        <Text style={styles.cardAvatarText}>{vaca.nombre?.[0]?.toUpperCase() || '?'}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNombre}>{vaca.nombre}</Text>
        <Text style={styles.cardCodigo}>Código: {vaca.codigo}</Text>
        {vaca.numero_arete && (
          <Text style={styles.cardArete}>Arete: {vaca.numero_arete}</Text>
        )}
      </View>
      <View style={styles.cardRight}>
        <StatusBadge estado={vaca.estado} />
        <Text style={styles.cardRaza}>{vaca.raza}</Text>
      </View>
    </View>
    {vaca.produccion_leche_dia > 0 && (
      <View style={styles.cardFooter}>
        <Ionicons name="water-outline" size={13} color={COLORS.info} />
        <Text style={styles.cardProduccion}>{vaca.produccion_leche_dia} L/día</Text>
      </View>
    )}
    <View style={styles.cardActions}>
      <TouchableOpacity style={styles.cardActionButton} onPress={onPress} activeOpacity={0.85}>
        <Ionicons name="eye-outline" size={16} color={COLORS.primary} />
        <Text style={styles.cardActionText}>Ver</Text>
      </TouchableOpacity>
      {canEdit && (
        <TouchableOpacity style={styles.cardActionButton} onPress={onEdit} activeOpacity={0.85}>
          <Ionicons name="create-outline" size={16} color={COLORS.primary} />
          <Text style={styles.cardActionText}>Editar</Text>
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
);

export const ListaVacasScreen = ({ navigation }) => {
  const { tienePermiso } = useAuth();
  const [vacas, setVacas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [filtroRaza, setFiltroRaza] = useState(null);

  const cargarVacas = useCallback(() => {
    const data = getVacas({ busqueda, estado: filtroEstado, raza: filtroRaza });
    setVacas(data);
  }, [busqueda, filtroEstado, filtroRaza]);

  useFocusEffect(
    useCallback(() => {
      cargarVacas();
    }, [cargarVacas])
  );

  const estados = [null, ...Object.values(ESTADOS_VACA)];

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar por nombre, código o arete..."
          placeholderTextColor={COLORS.textLight}
          style={styles.searchInput}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de estado */}
      <View style={styles.filtrosContainer}>
        <FlatList
          horizontal
          data={estados}
          keyExtractor={(item) => item || 'todos'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filtroBtn,
                filtroEstado === item && styles.filtroBtnActive,
              ]}
              onPress={() => setFiltroEstado(item === filtroEstado ? null : item)}
            >
              <Text
                style={[
                  styles.filtroBtnText,
                  filtroEstado === item && styles.filtroBtnTextActive,
                ]}
              >
                {item || 'Todas'}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.razaFilterWrap}>
        <Select
          label="Filtrar por raza"
          value={filtroRaza}
          onValueChange={(value) => setFiltroRaza(value || null)}
          options={[{ label: 'Todas las razas', value: null }, ...RAZAS.map((raza) => ({ label: raza, value: raza }))]}
          placeholder="Todas las razas"
          buscable
        />
      </View>

      {/* Listado */}
      <FlatList
        data={vacas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <VacaCard
            vaca={item}
            onPress={() => navigation.navigate(ROUTES.DETALLE_VACA, { vacaId: item.id })}
            onEdit={() => navigation.navigate(ROUTES.EDITAR_VACA, { vacaId: item.id })}
            canEdit={tienePermiso('puede_editar_vacas')}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="sad-outline"
            title="No hay vacas registradas"
            subtitle={busqueda ? 'No se encontraron resultados para tu búsqueda' : 'Comienza registrando una nueva vaca'}
            action={tienePermiso('puede_registrar_vacas') ? 'Registrar vaca' : null}
            onAction={() => navigation.navigate(ROUTES.REGISTRAR_VACA)}
          />
        }
        ListHeaderComponent={
          vacas.length > 0 ? (
            <Text style={styles.totalText}>{vacas.length} {vacas.length === 1 ? 'vaca' : 'vacas'}</Text>
          ) : null
        }
      />

      {/* FAB */}
      {tienePermiso('puede_registrar_vacas') && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate(ROUTES.REGISTRAR_VACA)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color={COLORS.textWhite} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOWS.small,
  },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  filtrosContainer: { marginBottom: SPACING.xs },
  razaFilterWrap: { paddingHorizontal: SPACING.md },
  filtrosList: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  filtroBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filtroBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filtroBtnText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  filtroBtnTextActive: { color: COLORS.textWhite },
  list: { paddingHorizontal: SPACING.md, paddingBottom: 100 },
  totalText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFEBE9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  cardAvatarText: {
    position: 'absolute',
    fontSize: FONTS.sizes.md,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  cardInfo: { flex: 1 },
  cardNombre: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  cardCodigo: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  cardArete: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  cardRight: { alignItems: 'flex-end', gap: SPACING.xs },
  cardRaza: { fontSize: FONTS.sizes.xs, color: COLORS.textLight, marginTop: 4 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: 4,
  },
  cardProduccion: { fontSize: FONTS.sizes.xs, color: COLORS.info, fontWeight: '600' },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  cardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.full,
  },
  cardActionText: {
    marginLeft: 4,
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
});
