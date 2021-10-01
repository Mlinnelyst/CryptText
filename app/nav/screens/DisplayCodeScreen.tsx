import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';
import QRCode from 'react-native-qrcode-svg';
import { ClientKeyContext } from '../../providers/ClientKeyProvider';
import Colors from '../../styles/Colors';
import { SocketContext } from '../../providers/SocketProvider';
import { ContactsContext } from '../../providers/ContactsProvider';

export function DisplayCodeScreen({ navigation }: MainNavProps<'DisplayCode'>) {
	const { contacts } = useContext(ContactsContext);
	const { socket } = useContext(SocketContext);
	const { client } = useContext(ClientKeyContext);

	const screenWidth = Dimensions.get('screen').width;
	const codeSize = screenWidth * 0.8;

	useEffect(() => {
		navigation.setOptions({ headerShown: contacts.length != 0 });

		// Add socket listener
		socket.on('public_key_scanned', (scanned_by_public_key: string) => {
			console.log('Public key scanned!');
			navigation.push('EstablishSecret', {
				recipientPublicKey: scanned_by_public_key,
				clientScannedPublicKey: false,
			});
		});

		return () => {
			console.log('Removed socket on scan hook.');
			socket.off('public_key_scanned');
		};
	}, []);

	return (
		<View style={[Styles.view, Styles.centeredView]}>
			<View style={{ width: '80%', flex: 1 }}>
				<View style={{ flex: 1 }}></View>

				<View
					style={{
						alignItems: 'center',
						width: codeSize,
						height: codeSize,
					}}
				>
					<QRCode
						value={client.publicKey}
						size={codeSize}
						color={Colors.lightGray}
						backgroundColor={Colors.darkBlue}
					/>
				</View>
				<View style={{ flex: 1 }}></View>
				<View style={{ flex: 5 }}>
					<Text style={Styles.title}>Instructions</Text>
					<Text style={Styles.text}>
						Tell your contact to open the scanner by pressing '+' in the
						overview. Point their camera and scan the code.
					</Text>
				</View>

				<View style={{ flex: 2 }}>
					<IconButton
						onPress={() => navigation.navigate('ScanCode')}
						iconName='camera'
						text='Scan a code'
						height={Dimensions.get('screen').height * 0.06}
						width={Dimensions.get('screen').width * 0.8}
					/>
				</View>
			</View>
		</View>
	);
}
