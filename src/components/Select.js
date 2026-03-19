import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SPACING, FONTS, SHADOWS } from '../constants/theme';

export const Select = ({
  label,
  value,
  onValueChange,
  options = [],
  placeholder = 'Seleccionar...',
  error,
  required = false,
  style,
  buscable = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const opcionSeleccionada = options.find((o) =>
    typeof o === 'string' ? o === value : o.value === value
  );

  const labelOpcion = opcionSeleccionada
    ? typeof opcionSeleccionada === 'string'
      ? opcionSeleccionada
      : opcionSeleccionada.label
    : null;

  const opcionesFiltradas = buscable
    ? options.filter((o) => {
        const texto = typeof o === 'string' ? o : o.label;
        return texto.toLowerCase().includes(busqueda.toLowerCase());
      })
    : options;

  const seleccionar = (opcion) => {
    const val = typeof opcion === 'string' ? opcion : opcion.value;
    onValueChange(val);
    setModalVisible(false);
    setBusqueda('');
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TouchableOpacity
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.selectorText, !labelOpcion && styles.placeholder]}>
          {labelOpcion || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Seleccionar'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            {buscable && (
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={COLORS.textLight} style={styles.searchIcon} />
                <TextInput
                  value={busqueda}
                  onChangeText={setBusqueda}
                  placeholder="Buscar..."
                  placeholderTextColor={COLORS.textLight}
                  style={styles.searchInput}
                />
              </View>
            )}
            <FlatList
              data={opcionesFiltradas}
              keyExtractor={(item, idx) => (typeof item === 'string' ? item : item.value || String(idx))}
              renderItem={({ item }) => {
                const label = typeof item === 'string' ? item : item.label;
                const val = typeof item === 'string' ? item : item.value;
                const selected = value === val;
                return (
                  <TouchableOpacity
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => seleccionar(item)}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {label}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: { color: COLORS.error },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...SHADOWS.small,
  },
  selectorError: { borderColor: COLORS.error },
  selectorText: { fontSize: FONTS.sizes.md, color: COLORS.text, flex: 1 },
  placeholder: { color: COLORS.textLight },
  errorText: { fontSize: FONTS.sizes.xs, color: COLORS.error, marginTop: SPACING.xs },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '70%',
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.borderLight,
  },
  searchIcon: { marginRight: SPACING.xs },
  searchInput: { flex: 1, paddingVertical: SPACING.sm, color: COLORS.text, fontSize: FONTS.sizes.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  optionSelected: { backgroundColor: COLORS.primaryBackground },
  optionText: { fontSize: FONTS.sizes.md, color: COLORS.text },
  optionTextSelected: { color: COLORS.primary, fontWeight: '600' },
  separator: { height: 1, backgroundColor: COLORS.borderLight },
});
