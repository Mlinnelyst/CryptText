import React, { useContext, useEffect } from 'react';
import { Button, View } from 'react-native';
import Styles from '../../styles/Styles';
import { MainNavProps } from '../MainParamList';

export function ChatScreen({ navigation }: MainNavProps<'Chat'>) {
	useEffect(() => {}, []);

	return <View style={[Styles.view, { alignItems: 'center' }]}></View>;
}
