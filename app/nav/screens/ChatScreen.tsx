import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Button, Dimensions, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Styles, { transitionDuration } from '../../styles/Styles';
import {
	hookTransitionEvents,
	unHookTransitionEvents,
} from '../../utility/transitionEventHooks';
import { MainNavProps } from '../MainParamList';

export function ChatScreen({ navigation }: MainNavProps<'Chat'>) {
	const transitionEvents = hookTransitionEvents(navigation);

	useEffect(() => {
		return () => {
			unHookTransitionEvents(navigation, transitionEvents);
		};
	}, []);

	return (
		<Animated.View style={[Styles.view, { alignItems: 'center' }]}>
			<Animated.View
				style={{
					backgroundColor: 'red',
					width: 100,
					height: 100,
					translateX: transitionEvents.progress.interpolate({
						inputRange: [0, 1],
						outputRange: [100, 0],
					}),
				}}
			></Animated.View>
		</Animated.View>
	);
}
