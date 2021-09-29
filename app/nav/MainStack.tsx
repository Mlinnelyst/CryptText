import React, { useContext } from 'react';
import {
	createStackNavigator,
	TransitionPresets,
} from '@react-navigation/stack';
import { MainParamList } from './MainParamList';
import { ContactsOverviewScreen } from './screens/ContactsOverviewScreen';
import Colors from '../styles/Colors';
import Styles from '../styles/Styles';
import { ContactsContext } from '../providers/ContactsProvider';
import { IntroScreen } from './screens/IntroScreen';
import { DisplayCodeScreen } from './screens/DisplayCodeScreen';
import { ScanCodeScreen } from './screens/ScanCodeScreen';

interface ContactsStackProps {}

const Stack = createStackNavigator<MainParamList>();

export const MainStack: React.FC<ContactsStackProps> = ({}) => {
	const { contacts } = useContext(ContactsContext);

	return (
		<Stack.Navigator
			initialRouteName={contacts.length == 0 ? 'Intro' : 'ContactsOverview'}
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
				...TransitionPresets.SlideFromRightIOS,
				gestureDirection: 'horizontal',
				gestureEnabled: true,
			}}
		>
			<Stack.Screen
				name='ContactsOverview'
				component={ContactsOverviewScreen}
				options={{ headerTitle: 'Contacts' }}
			/>
			<Stack.Screen
				name='Intro'
				component={IntroScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='DisplayCode'
				component={DisplayCodeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='ScanCode'
				component={ScanCodeScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
};
