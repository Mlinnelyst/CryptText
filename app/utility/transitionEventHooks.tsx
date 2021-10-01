import { StackNavigationProp } from '@react-navigation/stack';
import { Animated } from 'react-native';
import { MainParamList } from '../nav/MainParamList';
import { transitionDuration } from '../styles/Styles';

interface TransitionEvents {
	blurEvent: () => void;
	focusEvent: () => void;
}

export function hookTransitionEvents(
	transitionProgress: Animated.Value,
	navigation: StackNavigationProp<MainParamList>
): TransitionEvents {
	const blurEvent = () => {
		Animated.timing(transitionProgress, {
			toValue: 0,
			duration: transitionDuration / 2,
			useNativeDriver: true,
		}).start();
	};

	const focusEvent = () => {
		Animated.timing(transitionProgress, {
			toValue: 1,
			duration: transitionDuration / 2,
			delay: transitionDuration / 2,
			useNativeDriver: true,
		}).start();
	};

	navigation.addListener('blur', blurEvent);
	navigation.addListener('focus', focusEvent);

	return { blurEvent, focusEvent };
}

export function unHookTransitionEvents(
	navigation: StackNavigationProp<MainParamList>,
	events: TransitionEvents
) {
	navigation.removeListener('blur', events.blurEvent);
	navigation.removeListener('focus', events.focusEvent);
}
