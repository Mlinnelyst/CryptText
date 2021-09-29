import React, { useContext, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';

export function EstablishSecretModal({
	navigation,
}: MainNavProps<'EstablishSecret'>) {
	return (
		<View style={[Styles.view, Styles.centeredView]}>
			<View style={{ width: '80%', flex: 1 }}>
				<Text>Hello world</Text>
			</View>
		</View>
	);
}
