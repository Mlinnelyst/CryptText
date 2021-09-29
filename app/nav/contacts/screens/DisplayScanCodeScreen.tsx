import React, { useContext, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Dimensions,
	Text,
	View,
} from 'react-native';
import IconButton from '../../../components/IconButton';
import { ClientKeyContext } from '../../../providers/ClientKeyProvider';
import Styles from '../../../styles/Styles';
import { ContactsNavProps } from '../ContactsParamList';
import QRCode from 'react-native-qrcode-svg';
import Colors from '../../../styles/Colors';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import IconSvg from '../../../components/IconSvg';
import { UserDataContext } from '../../../providers/UserDataProvider';
import { ContactsContext } from '../../../providers/ContactsProvider';

export function DisplayScanCodeScreen({
	navigation,
}: ContactsNavProps<'DisplayScanCode'>) {
	const { client } = useContext(ClientKeyContext);
	const { contacts } = useContext(ContactsContext);
	const [hasPermission, setHasPermission] = React.useState(false);

	const screenWidth = Dimensions.get('screen').width;

	const animatedValue = useRef(
		new Animated.Value(contacts.length == 0 ? 0 : screenWidth)
	);

	const scanCodePressed = () => {
		Animated.spring(animatedValue.current, {
			toValue: screenWidth * 2,
			useNativeDriver: true,
		}).start(() => {
			if (!hasPermission) {
				(async () => {
					const { status } = await BarCodeScanner.requestPermissionsAsync();
					setHasPermission(status === 'granted');
				})();
			}
		});
	};

	const displayCodePressed = () => {
		Animated.spring(animatedValue.current, {
			toValue: screenWidth,
			useNativeDriver: true,
		}).start(() => {});
	};

	const codeSize = screenWidth * 0.8;

	return (
		<View style={{ flex: 1, width: 3 * screenWidth, flexDirection: 'row' }}>
			<Animated.View
				style={[
					Styles.view,
					{
						alignItems: 'center',
						transform: [
							{
								translateX: animatedValue.current.interpolate({
									inputRange: [0, screenWidth],
									outputRange: [0, -screenWidth],
								}),
							},
						],
						width: screenWidth,
					},
				]}
			>
				<View style={{ width: '80%', flex: 1 }}>
					<View style={{ flex: 1 }}></View>
					<IconSvg style={{ width: codeSize, height: codeSize }} />
					<View style={{ flex: 1 }}></View>
					<View style={{ flex: 5 }}>
						<Text style={Styles.title}>Get started using CryptText</Text>
						<Text style={Styles.text}>
							CryptText uses a unique generated keypair to encrypt communication
							between you and your contacts.
						</Text>
						<Text style={Styles.text}>
							To get started, scan the code shown on your contacts phone, or
							have them scan your code.
						</Text>
					</View>

					<View style={{ flex: 2 }}>
						<IconButton
							onPress={displayCodePressed}
							iconName='contacts'
							text='Add first contact'
							height={Dimensions.get('screen').height * 0.06}
							width={Dimensions.get('screen').width * 0.8}
						/>
					</View>
				</View>
			</Animated.View>
			<Animated.View
				style={[
					Styles.view,
					{
						alignItems: 'center',
						transform: [
							{
								translateX: animatedValue.current.interpolate({
									inputRange: [0, screenWidth],
									outputRange: [0, -screenWidth],
								}),
							},
						],
						width: screenWidth,
					},
				]}
			>
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
			</Animated.View>
			<Animated.View
				style={[
					Styles.view,
					{
						alignItems: 'center',
						transform: [
							{
								translateX: animatedValue.current.interpolate({
									inputRange: [0, screenWidth],
									outputRange: [0, -screenWidth],
								}),
							},
						],
						width: screenWidth,
					},
				]}
			>
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
							onPress={displayCodePressed}
							iconName='qrcode'
							text='Display your code'
							height={Dimensions.get('screen').height * 0.06}
							width={Dimensions.get('screen').width * 0.8}
						/>
					</View>
				</View>
			</Animated.View>
		</View>
	);
}
