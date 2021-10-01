import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Colors from '../../styles/Colors';
import { ContactsContext } from '../../providers/ContactsProvider';

export function ScanCodeScreen({ navigation }: MainNavProps<'ScanCode'>) {
	const { contacts } = useContext(ContactsContext);
	const [hasPermission, setHasPermission] = useState(false);

	var barCodeScannedTs = 0;

	const screenWidth = Dimensions.get('screen').width;
	const codeSize = screenWidth * 0.8;

	useEffect(() => {
		navigation.setOptions({ headerShown: contacts.length != 0 });

		const getCameraPermission = () => {
			// Get camera permission
			if (!hasPermission) {
				(async () => {
					const { status } = await BarCodeScanner.requestPermissionsAsync();
					setHasPermission(status === 'granted');
				})();
			}
		};

		navigation.addListener('transitionEnd', getCameraPermission);

		return () => {
			navigation.removeListener('transitionEnd', getCameraPermission);
		};
	}, [barCodeScannedTs, hasPermission]);

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
					{hasPermission && !barCodeScannedTs ? (
						<BarCodeScanner
							onBarCodeScanned={(params) => {
								if (new Date().getTime() - barCodeScannedTs > 2.5 * 1000) {
									barCodeScannedTs = new Date().getTime();

									console.log('BAR CODE SCANNED ' + barCodeScannedTs);
									navigation.push('EstablishSecret', {
										clientScannedPublicKey: true,
										recipientPublicKey: params.data,
									});
								}
							}}
							style={{ width: codeSize, height: codeSize }}
						/>
					) : (
						<View style={[Styles.view, Styles.centeredView]}>
							<ActivityIndicator size='large' color={Colors.blue} />
						</View>
					)}
				</View>
				<View style={{ flex: 1 }}></View>
				<View style={{ flex: 5 }}>
					<Text style={Styles.title}>Instructions</Text>
					<Text style={Styles.text}>
						Tell your contact to display their code by pressing the '+' in the
						overview. Point your camera and scan their code.
					</Text>
				</View>

				<View style={{ flex: 2 }}>
					<IconButton
						onPress={() => navigation.pop()}
						iconName='qrcode'
						text='Display your code'
						height={Dimensions.get('screen').height * 0.06}
						width={Dimensions.get('screen').width * 0.8}
					/>
				</View>
			</View>
		</View>
	);
}
