import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Button, FlatList, View, Text } from 'react-native';
import { MessageComponent } from '../../components/MessageComponent';
import { useFirstRender } from '../../components/useFirstRender';
import { MessageData } from '../../cryptography/message';
import { ClientKeyContext } from '../../providers/ClientKeyProvider';
import { MessagesContext } from '../../providers/MessagesProvider';
import Styles, { transitionDuration } from '../../styles/Styles';
import {
	hookTransitionEvents,
	unHookTransitionEvents,
} from '../../utility/transitionEventHooks';
import { MainNavProps } from '../MainParamList';

export function ChatScreen({ navigation, route }: MainNavProps<'Chat'>) {
	const { client } = useContext(ClientKeyContext);
	const { sendMessage, messagesChanged, getContactMessages } =
		useContext(MessagesContext);
	const transitionEvents = hookTransitionEvents(navigation);

	var messages = getContactMessages(route.params.contact);

	useEffect(() => {
		navigation.setOptions({
			headerTitle: route.params.contact.name,
		});

		return () => {
			unHookTransitionEvents(navigation, transitionEvents);
		};
	}, []);

	useEffect(() => {
		//setMessages(getContactMessages(route.params.contact));
		messages = getContactMessages(route.params.contact);
		setTimeout(() => {
			list?.scrollToEnd({ animated: true });
		}, 100);
	}, [messagesChanged]);

	const [list, setList] = useState<FlatList<MessageData> | null>(null);

	useEffect(() => {
		if (list != null) {
			setTimeout(() => {
				list?.scrollToEnd({ animated: false });
			}, transitionDuration / 2);

			//setTimeout(() => {
			//setMessages(getContactMessages(route.params.contact));
			//}, transitionDuration);
		}
	}, [list]);

	return (
		<View style={Styles.view}>
			<Animated.View
				style={[
					Styles.roundCardView,
					{
						backgroundColor: 'transparent',
					},
				]}
			>
				<FlatList
					ref={(list) => {
						setList(list);
					}}
					data={messages}
					keyExtractor={(message) => {
						return message.timestamp.toString();
					}}
					style={{
						marginTop: 12,
						flex: 1,
					}}
					renderItem={(info) => (
						<MessageComponent
							message={info.item}
							transitionEvents={transitionEvents}
							sentByUser={client.publicKey == info.item.senderPublicKey}
							previousMessageSentBySameUser={
								info.index == 0
									? false
									: messages[info.index].senderPublicKey ==
									  messages[info.index - 1].senderPublicKey
							}
						/>
					)}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						justifyContent: 'flex-end',
					}}
					scrollEnabled={true}
					initialNumToRender={messages.length}
					removeClippedSubviews={true}
				/>
				<Button
					title={`Send debug message ${
						getContactMessages(route.params.contact).length
					}`}
					onPress={() => {
						sendMessage(route.params.contact, `2 ${new Date().toISOString()}`);
					}}
				/>
			</Animated.View>
		</View>
	);
}
