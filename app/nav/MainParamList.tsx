import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type MainParamList = {
	ContactsOverview: undefined;
	Chat: undefined;
	DisplayScanCode: undefined;
};

export type MainNavProps<T extends keyof MainParamList> = {
	navigation: StackNavigationProp<MainParamList, T>;
	route: RouteProp<MainParamList, T>;
};
