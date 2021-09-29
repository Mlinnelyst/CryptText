import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MainParamList } from '../nav/MainParamList';
import { Contact, ContactsContext } from '../providers/ContactsProvider';
import Colors from '../styles/Colors';
import Styles from '../styles/Styles';
import { ContactNameCircleComponent } from './ContactNameCircle';

export function ContactComponent({
	contact,
	navigation,
}: {
	contact: Contact;
	navigation: StackNavigationProp<MainParamList, 'ContactsOverview'>;
}) {
	const { contacts } = useContext(ContactsContext);

	useEffect(() => {});

	return (
		<TouchableOpacity
			style={{
				width: '90%',
				alignSelf: 'center',
				flexDirection: 'row',
				marginTop: 3,
				marginBottom: 3,
			}}
			onPress={() => {
				navigation.navigate('Chat', { contact });
			}}
		>
			<View style={{ flex: 1, marginRight: 10 }}>
				<ContactNameCircleComponent contact={contact} />
			</View>
			<View
				style={{
					flex: 5,
					borderBottomWidth: 1,
					borderBottomColor: Colors.lightGray,
				}}
			>
				<Text
					style={[
						Styles.title,
						{
							marginBottom: 0,
							color: Colors.darkBlue,
							fontSize: Styles.text.fontSize,
						},
					]}
				>
					{contact.name}
				</Text>
				<Text style={[Styles.text, { fontSize: 13 }]}>
					{contact.latestMessageText ?? 'no messages yet...'}
				</Text>
			</View>
			<View style={{ flex: 1 }}>
				<View
					style={{
						flex: 1,
						alignContent: 'flex-start',
					}}
				>
					<Text style={[Styles.text]}>13.19</Text>
				</View>
				<View
					style={{
						flex: 1,
						alignContent: 'flex-start',
					}}
				></View>
			</View>
		</TouchableOpacity>
	);
}
