import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainParamList } from './MainParamList';
import { ContactsOverviewScreen } from './screens/ContactsOverviewScreen';
import { DisplayScanCodeScreen } from './screens/DisplayScanCodeScreen';
import Colors from '../styles/Colors';
import Styles from '../styles/Styles';
import { ContactsContext } from '../providers/ContactsProvider';

interface ContactsStackProps {}

const Stack = createStackNavigator<MainParamList>();

export const MainStack: React.FC<ContactsStackProps> = ({}) => {
	const { contacts } = useContext(ContactsContext);

	return (
		<Stack.Navigator
			initialRouteName={
				contacts.length == 0 ? 'DisplayScanCode' : 'ContactsOverview'
			}
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
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
};
