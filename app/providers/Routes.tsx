import React, { useState, useEffect, useContext } from 'react';
import {
	DefaultTheme,
	NavigationContainer,
	RouteProp,
} from '@react-navigation/native';
import { ActivityIndicator, Button, Text, View } from 'react-native';

import { UserDataContext } from './UserDataProvider';
import Colors from '../styles/Colors';
import Styles from '../styles/Styles';
import {
	useFonts,
	Poppins_400Regular,
	Poppins_300Light,
} from '@expo-google-fonts/poppins';
import { ContactsContext } from './ContactsProvider';
import { ClientKeyContext } from './ClientKeyProvider';
import { MainStack } from '../nav/MainStack';

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
	const { getUserData, setUserData } = useContext(UserDataContext);
	const { getContacts } = useContext(ContactsContext);
	const { getClient } = useContext(ClientKeyContext);
	const [loading, setLoading] = useState(false);

	let [fontsLoaded] = useFonts({
		Poppins_400Regular,
		Poppins_300Light,
	});

	useEffect(() => {
		// Calculate and get data from async storage
		Promise.all([getUserData(), getContacts(), getClient()]).then(() => {
			setLoading(false);
		});
	}, []);

	if (loading || !fontsLoaded) {
		return (
			<View style={[Styles.view, Styles.centeredView]}>
				<ActivityIndicator size='large' color={Colors.blue} />
			</View>
		);
	}

	const navTheme = DefaultTheme;
	navTheme.colors.background = Colors.darkBlue;

	return (
		<NavigationContainer theme={navTheme}>
			<MainStack />
		</NavigationContainer>
	);
};
