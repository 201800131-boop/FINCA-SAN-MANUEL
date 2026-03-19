import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONTS, SHADOWS } from '../constants/theme';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) => {
  const variantStyle = styles[`btn_${variant}`] || styles.btn_primary;
  const textVariantStyle = styles[`btnText_${variant}`] || styles.btnText_primary;
  const sizeStyle = styles[`btnSize_${size}`] || styles.btnSize_md;
  const textSizeStyle = styles[`btnTextSize_${size}`] || styles.btnTextSize_md;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        variantStyle,
        sizeStyle,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.textWhite} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.baseText, textVariantStyle, textSizeStyle, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: SPACING.sm,
  },

  // Variantes
  btn_primary: { backgroundColor: COLORS.primary, ...SHADOWS.small },
  btn_secondary: { backgroundColor: COLORS.secondary, ...SHADOWS.small },
  btn_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  btn_ghost: { backgroundColor: 'transparent' },
  btn_danger: { backgroundColor: COLORS.error, ...SHADOWS.small },
  btn_success: { backgroundColor: COLORS.success, ...SHADOWS.small },
  btn_warning: { backgroundColor: COLORS.warning, ...SHADOWS.small },

  // Texto
  baseText: { fontWeight: '600' },
  btnText_primary: { color: COLORS.textWhite },
  btnText_secondary: { color: COLORS.textWhite },
  btnText_outline: { color: COLORS.primary },
  btnText_ghost: { color: COLORS.primary },
  btnText_danger: { color: COLORS.textWhite },
  btnText_success: { color: COLORS.textWhite },
  btnText_warning: { color: COLORS.textWhite },

  // Tamaños
  btnSize_sm: { paddingVertical: SPACING.xs + 2, paddingHorizontal: SPACING.md },
  btnSize_md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl },
  btnSize_lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl },
  btnSize_full: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, width: '100%' },

  btnTextSize_sm: { fontSize: FONTS.sizes.sm },
  btnTextSize_md: { fontSize: FONTS.sizes.md },
  btnTextSize_lg: { fontSize: FONTS.sizes.lg },
  btnTextSize_full: { fontSize: FONTS.sizes.md },

  disabled: { opacity: 0.5 },
});
