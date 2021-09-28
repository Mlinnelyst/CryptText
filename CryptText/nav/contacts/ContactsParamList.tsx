import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type ContactsParamList = {
	ContactsOverview: undefined;
	Chat: undefined;
	DisplayScanCode: undefined;
};

export type ContactsNavProps<T extends keyof ContactsParamList> = {
	navigation: StackNavigationProp<ContactsParamList, T>;
	route: RouteProp<ContactsParamList, T>;
};
