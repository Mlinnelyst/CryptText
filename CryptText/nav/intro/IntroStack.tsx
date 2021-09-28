import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { IntroParamList, IntroNavProps } from './IntroParamList';
import { InfoScreen } from './InfoScreen';

interface IntroStackProps {}

const Stack = createStackNavigator<IntroParamList>();

export const IntroStack: React.FC<IntroStackProps> = ({}) => {
	return (
		<Stack.Navigator
			screenOptions={{
				header: () => null,
			}}
			initialRouteName='Info'
		>
			<Stack.Screen name='Info' component={InfoScreen} />
		</Stack.Navigator>
	);
};
