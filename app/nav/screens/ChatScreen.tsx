import React, { useContext, useEffect, useRef } from 'react';
import { Animated, Button } from 'react-native';
import { MessagesContext } from '../../providers/MessagesProvider';
import Styles from '../../styles/Styles';
import {
	hookTransitionEvents,
	unHookTransitionEvents,
} from '../../utility/transitionEventHooks';
import { MainNavProps } from '../MainParamList';

export function ChatScreen({ navigation, route }: MainNavProps<'Chat'>) {
	const { sendMessage, messagesChanged, getContactMessages } =
		useContext(MessagesContext);
	const transitionEvents = hookTransitionEvents(navigation);

	useEffect(() => {
		return () => {
			unHookTransitionEvents(navigation, transitionEvents);
		};
	}, [messagesChanged]);

	return (
		<Animated.View style={[Styles.view, { alignItems: 'center' }]}>
			<Animated.View
				style={{
					backgroundColor: 'red',
					width: 100,
					height: 100,
					translateX: transitionEvents.progress.interpolate({
						inputRange: [0, 1],
						outputRange: [-100, 0],
					}),
				}}
			></Animated.View>

			<Button
				title={`Send debug message ${
					getContactMessages(route.params.contact).length
				}`}
				onPress={() => {
					sendMessage(
						route.params.contact,
						`Test message new ${
							getContactMessages(route.params.contact).length
						}`
					);
				}}
			/>
		</Animated.View>
	);
}
