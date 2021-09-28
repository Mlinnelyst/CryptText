import React, { useContext, useEffect } from 'react';
import { Button, View } from 'react-native';
import { ContactsContext } from '../../../providers/ContactsProvider';
import Styles from '../../../styles/Styles';
import { ContactsNavProps } from '../ContactsParamList';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../../../styles/Colors';
import { UserDataContext } from '../../../providers/UserDataProvider';

export function ContactsOverviewScreen({
	navigation,
}: ContactsNavProps<'ContactsOverview'>) {
	const { userData, setUserData } = useContext(UserDataContext);
	const { contacts } = useContext(ContactsContext);

	useEffect(() => {
		// Set headerrigt
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity
					onPress={() => {
						navigation.push('DisplayScanCode');
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
	}, []);

	return (
		<View style={[Styles.view, { alignItems: 'center' }]}>
			<Button
				title='Dev remove has completed intro'
				onPress={() => {
					setUserData({ ...userData, firstTimeSetupComplete: false });
				}}
			></Button>
		</View>
	);
}
