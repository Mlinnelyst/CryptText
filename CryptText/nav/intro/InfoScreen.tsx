import React, { useContext } from 'react';
import { Button, Dimensions, Text, View } from 'react-native';
import IconButton from '../../components/IconButton';
import IconSvg from '../../components/IconSvg';
import { UserDataContext } from '../../providers/UserDataProvider';
import Styles from '../../styles/Styles';
import { IntroNavProps } from './IntroParamList';

export function InfoScreen({ navigation }: IntroNavProps<'Info'>) {
	const { userData, setUserData } = useContext(UserDataContext);

	const addContactPressed = () => {
		setUserData({
			...userData,
			firstTimeSetupComplete: true,
		});
	};

	return (
		<View style={[Styles.view, { alignItems: 'center' }]}>
			<View style={{ width: '80%', flex: 1 }}>
				<View style={{ flex: 6 }}>
					<IconSvg />
				</View>
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
						onPress={addContactPressed}
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
