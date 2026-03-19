import React from 'react';
import { Alert } from 'react-native';
import { VacaForm } from './VacaForm';
import { ROUTES } from '../../constants';
import { crearVaca } from '../../database/database';
import { useAuth } from '../../context/AuthContext';

export const RegistrarVacaScreen = ({ navigation }) => {
	const { usuario } = useAuth();

	const handleSubmit = async (payload, action, helpers) => {
		crearVaca({
			...payload,
			creado_por: usuario?.id || null,
		});

		if (action === 'save_and_continue') {
			helpers.clearForm();
			Alert.alert('Registro guardado', 'La vaca fue registrada y el formulario quedó listo para continuar.');
			return;
		}

		helpers.allowExit();
		Alert.alert('Registro guardado', 'La vaca fue registrada correctamente.', [
			{
				text: 'Aceptar',
				onPress: () => navigation.navigate(ROUTES.LISTA_VACAS),
			},
		]);
	};

	return <VacaForm mode="create" onSubmit={handleSubmit} />;
};
