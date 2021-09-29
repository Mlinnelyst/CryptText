import React, { useContext } from 'react';
import {
	CardStyleInterpolators,
	createStackNavigator,
	HeaderStyleInterpolators,
	TransitionPreset,
	TransitionPresets,
	TransitionSpecs,
} from '@react-navigation/stack';
import { MainParamList } from './MainParamList';
import { ContactsOverviewScreen } from './screens/ContactsOverviewScreen';
import Colors from '../styles/Colors';
import Styles from '../styles/Styles';
import { ContactsContext } from '../providers/ContactsProvider';
import { IntroScreen } from './screens/IntroScreen';
import { DisplayCodeScreen } from './screens/DisplayCodeScreen';
import { ScanCodeScreen } from './screens/ScanCodeScreen';
import { EstablishSecretModal } from './modals/EstablishSecretModal';

interface ContactsStackProps {}

const Stack = createStackNavigator<MainParamList>();

const customTransition: TransitionPreset = {
	gestureDirection: 'horizontal',
	transitionSpec: {
		open: TransitionSpecs.TransitionIOSSpec,
		close: TransitionSpecs.TransitionIOSSpec,
	},
	headerStyleInterpolator: HeaderStyleInterpolators.forFade,
	cardStyleInterpolator: ({ current, next, layouts }) => {
		return {
			cardStyle: {
				transform: [
					{
						translateX: next
							? next.progress.interpolate({
									inputRange: [0, 1],
									outputRange: [0, -layouts.screen.width],
							  })
							: current.progress.interpolate({
									inputRange: [0, 1],
									outputRange: [layouts.screen.width, 0],
							  }),
					},
				],
			},
		};
	},
};

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
			}}
		>
			<Stack.Group
				screenOptions={{
					...customTransition,
					gestureDirection: 'horizontal',
					gestureEnabled: true,
				}}
			>
				<Stack.Screen
					name='ContactsOverview'
					component={ContactsOverviewScreen}
					options={{ headerTitle: 'Contacts' }}
				/>
				<Stack.Group
					screenOptions={{
						headerShown: contacts.length != 0,
						gestureEnabled: false,
					}}
				>
					<Stack.Screen name='DisplayCode' component={DisplayCodeScreen} />
					<Stack.Screen name='ScanCode' component={ScanCodeScreen} />
				</Stack.Group>

				<Stack.Screen
					name='Intro'
					component={IntroScreen}
					options={{ headerShown: false }}
				/>
			</Stack.Group>

			<Stack.Screen
				name='EstablishSecret'
				component={EstablishSecretModal}
				options={{ headerShown: false, presentation: 'transparentModal' }}
			/>
		</Stack.Navigator>
	);
};
