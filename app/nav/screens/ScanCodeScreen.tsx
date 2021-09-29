import React, { useContext, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';
import IconSvg from '../../components/IconSvg';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Colors from '../../styles/Colors';

export function ScanCodeScreen({ navigation }: MainNavProps<'ScanCode'>) {
	const [hasPermission, setHasPermission] = React.useState(false);

	const screenWidth = Dimensions.get('screen').width;
	const codeSize = screenWidth * 0.8;

	useState(() => {
		const getCameraPermission = () => {
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
	});

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
					{hasPermission ? (
						<BarCodeScanner
							onBarCodeScanned={() => {}}
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
