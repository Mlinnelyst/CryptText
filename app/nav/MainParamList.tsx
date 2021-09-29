import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type MainParamList = {
	ContactsOverview: undefined;
	Chat: undefined;
	DisplayCode: undefined;
	ScanCode: undefined;
	Intro: undefined;
	EstablishSecret: {
		recipientPublicKey: string;
		clientScannedPublicKey: boolean;
	};
};

export type MainNavProps<T extends keyof MainParamList> = {
	navigation: StackNavigationProp<MainParamList, T>;
	route: RouteProp<MainParamList, T>;
};
