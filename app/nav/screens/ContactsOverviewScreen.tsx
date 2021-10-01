import React, { useContext, useEffect, useRef } from 'react';
import { Button, View, Text, Animated } from 'react-native';
import { Contact, ContactsContext } from '../../providers/ContactsProvider';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';
import { AntDesign } from '@expo/vector-icons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../styles/Colors';
import { UserDataContext } from '../../providers/UserDataProvider';
import { ContactComponent } from '../../components/ContactComponent';
import { Divider } from 'react-native-elements/dist/divider/Divider';

export function ContactsOverviewScreen({
	navigation,
	route,
}: MainNavProps<'ContactsOverview'>) {
	const { contacts } = useContext(ContactsContext);

	const fadeAnim = useRef(new Animated.Value(1)).current;

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
		console.log('Contacts: ' + contacts.length);
	});

	const navigateToChat = (contact: Contact) => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 250,
			useNativeDriver: true,
		}).start(() => {
			navigation.navigate('Chat', { contact });
		});
	};

	return (
		<View style={[Styles.view, {}]}>
			<Animated.View
				style={[
					Styles.view,
					{
						backgroundColor: Colors.white,
						width: '90%',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						alignSelf: 'center',
						opacity: fadeAnim,
						translateY: fadeAnim.interpolate({
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
