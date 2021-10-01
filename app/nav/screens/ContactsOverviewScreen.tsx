import React, { useContext, useEffect, useRef } from 'react';
import { Button, View, Text, Animated } from 'react-native';
import { Contact, ContactsContext } from '../../providers/ContactsProvider';
import Styles, { transitionDuration } from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';
import { AntDesign } from '@expo/vector-icons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../styles/Colors';
import { UserDataContext } from '../../providers/UserDataProvider';
import { ContactComponent } from '../../components/ContactComponent';
import {
	hookTransitionEvents,
	unHookTransitionEvents,
} from '../../utility/transitionEventHooks';

export function ContactsOverviewScreen({
	navigation,
	route,
}: MainNavProps<'ContactsOverview'>) {
	const { contacts } = useContext(ContactsContext);

	const transitionEvents = hookTransitionEvents(navigation);

	useEffect(() => {
		// Set headerright
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={() => {
						navigation.push('DisplayCode');
					}}
				>
					<AntDesign
						name={'plus'}
						size={30}
						style={{
							flex: 1,
							color: Colors.gray,
							alignSelf: 'flex-end',
							textAlignVertical: 'center',
							marginRight: 10,
						}}
					/>
				</TouchableOpacity>
			),
		});

		return () => {
			unHookTransitionEvents(navigation, transitionEvents);
		};
	});

	const navigateToChat = (contact: Contact) => {
		navigation.navigate('Chat', { contact });
	};

	return (
		<View style={Styles.view}>
			<Animated.View
				style={[
					Styles.view,
					{
						backgroundColor: Colors.white,
						width: '90%',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						alignSelf: 'center',

						translateY: transitionEvents.progress.interpolate({
							inputRange: [0, 1],
							outputRange: [100, 0],
						}),
					},
				]}
			>
				<FlatList
					data={contacts}
					keyExtractor={(item) => {
						const c = item as Contact;
						return c.conversationId;
					}}
					style={{ flex: 1, marginTop: 12 }}
					renderItem={(info) => (
						<ContactComponent
							contact={info.item}
							onPress={() => {
								navigateToChat(info.item);
							}}
						/>
					)}
				/>
			</Animated.View>
		</View>
	);
}
