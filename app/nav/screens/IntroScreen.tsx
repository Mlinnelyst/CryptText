import React, { useContext, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';
import IconSvg from '../../components/IconSvg';

export function IntroScreen({ navigation }: MainNavProps<'Intro'>) {
	const screenWidth = Dimensions.get('screen').width;

	const displayCodePressed = () => {
		console.log('Navigate to display code');
		navigation.push('DisplayCode');
	};

	const codeSize = screenWidth * 0.8;

	return (
		<View style={[Styles.view, Styles.centeredView]}>
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
						To get started, scan the code shown on your contacts phone, or have
						them scan your code.
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
		</View>
	);
}
