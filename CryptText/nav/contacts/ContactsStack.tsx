import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ContactsParamList } from './ContactsParamList';
import { ContactsOverviewScreen } from './screens/ContactsOverviewScreen';
import { DisplayScanCodeScreen } from './screens/DisplayScanCodeScreen';
import Colors from '../../styles/Colors';
import Styles from '../../styles/Styles';

interface ContactsStackProps {}

const Stack = createStackNavigator<ContactsParamList>();

export const ContactsStack: React.FC<ContactsStackProps> = ({}) => {
	return (
		<Stack.Navigator
			initialRouteName='ContactsOverview'
			screenOptions={{
				cardStyle: { backgroundColor: Colors.darkBlue },
				headerStyle: {
					backgroundColor: Colors.darkBlue,
				},
				headerTitleStyle: {
					...Styles.title,
					flex: 1,
					textAlignVertical: 'center',
					marginTop: 12,
				},
				headerTitleAlign: 'center',
				headerTintColor: Styles.title.color,
			}}
		>
			<Stack.Screen
				name='ContactsOverview'
				component={ContactsOverviewScreen}
				options={{ headerTitle: 'Contacts' }}
			/>
			<Stack.Screen
				name='DisplayScanCode'
				component={DisplayScanCodeScreen}
				options={{ headerTitle: 'Add contact' }}
			/>
		</Stack.Navigator>
	);
};
