import React, { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { EmptyState } from '../../components/UI';
import { actualizarVaca, getVacaById } from '../../database/database';
import { VacaForm } from './VacaForm';

export const EditarVacaScreen = ({ navigation, route }) => {
  const { vacaId } = route.params;
  const [vaca, setVaca] = useState(null);

  const cargar = useCallback(() => {
    setVaca(getVacaById(vacaId));
  }, [vacaId]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const handleSubmit = async (payload, _action, helpers) => {
    Alert.alert(
      'Guardar cambios',
      '¿Deseas guardar los cambios realizados en esta vaca?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Guardar cambios',
          onPress: () => {
            actualizarVaca(vacaId, payload);
            helpers.markSaved();
            helpers.allowExit();
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!vaca) {
    return (
      <View style={{ flex: 1 }}>
        <EmptyState
          icon="alert-circle-outline"
          title="No se encontró la vaca"
          subtitle="No fue posible cargar la información para editar."
        />
      </View>
    );
  }

  return <VacaForm mode="edit" initialValues={vaca} recordId={vacaId} onSubmit={handleSubmit} />;
};