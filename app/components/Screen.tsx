import React from 'react';
import { View, ScrollView } from 'react-native';
import Styles from '../styles/Styles';
import Container from './Container';

interface Props {
	children: React.ReactNode;
	action: React.ReactNode;
}

export default (props: Props) => {
	return (
		<View
			style={{
                flex: 1,
            }}
		>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'space-around',
                }}
            >
                {props.children}
            </ScrollView>

            {props.action ? (
                <View
                    style={Styles.defaultVerticalPadding}
                >
                    <Container>
                        {props.action}
                    </Container>
                </View>
            ) : null}
        </View>
	);
};
