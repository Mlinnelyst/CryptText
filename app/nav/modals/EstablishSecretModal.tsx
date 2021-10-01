import AntDesign from '@expo/vector-icons/build/AntDesign';
import React, { useContext, useState } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Text,
	View,
} from 'react-native';
import { ClientKeyContext } from '../../providers/ClientKeyProvider';
import { ContactsContext } from '../../providers/ContactsProvider';
import { SocketContext } from '../../providers/SocketProvider';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';

interface Event {
	text: string;
	pending?: boolean;
}

export function EstablishSecretModal({
	navigation,
	route,
}: MainNavProps<'EstablishSecret'>) {
	const { socket } = useContext(SocketContext);
	const { client, calculateSharedSecret } = useContext(ClientKeyContext);
	const { createContact, getContact } = useContext(ContactsContext);

	const [events, setEvents] = useState<Event[]>([]);

	const addEvent = (e: Event) => {
		if (events.length > 0) {
			events[events.length - 1].pending = false;
		}

		events.push(e);
	};

	useState(() => {
		const sharedSecretCalculation = () => {
			addEvent({ text: 'Calculating shared secret', pending: true });

			setTimeout(async () => {
				const sharedSecret = await calculateSharedSecret(
					route.params.recipientPublicKey
				);

				addEvent({ text: 'Creating contact', pending: true });
				await createContact(route.params.recipientPublicKey, sharedSecret);
				const contact = await getContact(route.params.recipientPublicKey);

				addEvent({ text: 'Navigating to conversation', pending: true });

				// Remove socket hook
				socket.off('public_key_scan_confirmed');

				setTimeout(() => {
					navigation.reset({
						index: 0,
						routes: [
							{
								name: 'ContactsOverview',
								params: {},
							},
							{
								name: 'Chat',
								params: { navigateToContactChat: contact },
							},
						],
					});
				}, 3000);
			}, 0);
		};

		if (route.params.clientScannedPublicKey) {
			addEvent({ text: 'Scanned key' });

			// Emit event to scanner
			addEvent({ text: 'Waiting for confirmation', pending: true });

			socket.on('public_key_scan_confirmed', () => {
				console.log('Public key scan confirmed');
				sharedSecretCalculation();
			});

			socket.emit(
				'scanned_public_key',
				route.params.recipientPublicKey,
				client.publicKey
			);
		} else {
			// Client was scanned
			addEvent({ text: 'Public key scanned' });

			// Emit event to scanner
			addEvent({ text: 'Emitting confirmation' });
			socket.emit(
				'confirm_public_key_scan',
				route.params.recipientPublicKey,
				client.publicKey
			);

			sharedSecretCalculation();
		}
	});

	const screenWidth = Dimensions.get('screen').width;
	const codeSize = screenWidth * 0.8;

	return (
		<View style={Styles.centeredView}>
			<View style={{ width: '80%', flex: 1, justifyContent: 'center' }}>
				<View style={{ flex: 1 }}></View>
				<Text style={Styles.title}>Key exchange</Text>
				<View style={[Styles.view, { flex: 3 }]}>
					<FlatList
						renderItem={({ item }) => {
							return (
								<View
									style={[
										Styles.view,
										{ justifyContent: 'space-between', flexDirection: 'row' },
									]}
								>
									<Text style={[Styles.text, { flex: 1 }]}>{item.text}</Text>
									<View
										style={{
											alignItems: 'flex-end',
											width: Styles.title.fontSize,
										}}
									>
										{item.pending ? (
											<ActivityIndicator
												color={Styles.title.color}
												style={{
													height: Styles.text.fontSize,
												}}
											/>
										) : (
											<AntDesign
												name={'check'}
												size={Styles.title.fontSize}
												style={{
													color: Styles.title.color,
													textAlignVertical: 'center',
													textAlign: 'center',
												}}
											/>
										)}
									</View>
								</View>
							);
						}}
						data={events}
						keyExtractor={(item, index) => index.toString()}
					></FlatList>
				</View>
				<View style={{ flex: 2 }}></View>
			</View>
		</View>
	);
}
