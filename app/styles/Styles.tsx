import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
	view: {
		flex: 1,
		backgroundColor: Colors.darkBlue,
	},
	centeredView: {
		flex: 1,
		backgroundColor: Colors.darkBlue,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		color: Colors.lightGray,
		fontSize: 22,
		marginBottom: 10,
		fontFamily: 'Poppins_400Regular',
	},
	text: {
		color: Colors.darkGray,
		fontSize: 18,
		fontFamily: 'Poppins_300Light',
	},
	centeredText: {
		textAlign: 'center',
		textAlignVertical: 'center',
	},
});

export const transitionDuration = 250;
