import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type IntroParamList = {
	Info: undefined;
};

export type IntroNavProps<T extends keyof IntroParamList> = {
	navigation: StackNavigationProp<IntroParamList, T>;
	route: RouteProp<IntroParamList, T>;
};
