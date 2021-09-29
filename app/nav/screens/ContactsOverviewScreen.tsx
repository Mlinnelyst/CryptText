import React, { useContext, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
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

	return (
		<View style={[Styles.view, {}]}>
			<View
				style={[
					Styles.view,
					{
						backgroundColor: Colors.white,
						width: '90%',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						alignSelf: 'center',
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
						<ContactComponent contact={info.item} navigation={navigation} />
					)}
				/>
			</View>
		</View>
	);
}
