import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { ActivityIndicator, Button, Text, View } from 'react-native';

import { IntroStack } from '../nav/intro/IntroStack';
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
import { ContactsStack } from '../nav/contacts/ContactsStack';

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
	const { userData, getUserData, setUserData } = useContext(UserDataContext);
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

	return (
		<NavigationContainer>
			{userData.firstTimeSetupComplete ? <ContactsStack /> : <IntroStack />}
		</NavigationContainer>
	);
};