import React, { useContext, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';
import QRCode from 'react-native-qrcode-svg';
import { ClientKeyContext } from '../../providers/ClientKeyProvider';
import Colors from '../../styles/Colors';

export function DisplayCodeScreen({ navigation }: MainNavProps<'DisplayCode'>) {
	const { client } = useContext(ClientKeyContext);
	const screenWidth = Dimensions.get('screen').width;

	const scanCodePressed = () => {
		console.log('Scan code pressed.');
		navigation.push('ScanCode');
		/*if (!hasPermission) {
			(async () => {
				const { status } = await BarCodeScanner.requestPermissionsAsync();
				setHasPermission(status === 'granted');
			})();
		}*/
	};

	const codeSize = screenWidth * 0.8;

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
						onPress={scanCodePressed}
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
