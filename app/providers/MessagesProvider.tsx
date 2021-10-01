import { decode } from 'base-64';
import React, { useContext, useEffect, useState } from 'react';
import { decrypt } from '../cryptography/encryption';
import {
	createMessage,
	createMessageData,
	Message,
	MessageData,
	verifyMessage,
} from '../cryptography/message';
import { ClientKeyContext } from './ClientKeyProvider';
import { Contact, ContactsContext } from './ContactsProvider';
import { SocketContext } from './SocketProvider';

type MessagesContextType = {
	getMessages(): Promise<void>;
	getContactMessages: (contact: Contact) => MessageData[];
	sendMessage: (contact: Contact, text: string) => Promise<void>;
	messagesChanged: number;
};

export const MessagesContext = React.createContext({} as MessagesContextType);

interface MessagesProviderProps {}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({
	children,
}) => {
	const { client } = useContext(ClientKeyContext);
	const { contacts } = useContext(ContactsContext);
	const { socket } = useContext(SocketContext);

	const [contactPKMessagesMap] = useState(new Map<string, MessageData[]>());

	const [messagesChanged, setMessagesChanged] = useState(0);

	useEffect(() => {
		return () => {
			socket?.off('new_message');
		};
	}, []);

	async function fetchContactMessages(
		contact: Contact
	): Promise<MessageData[]> {
		const url = `https://cipher.dk/chat/${contact.conversationId}/message`;

		// Fetch from api
		const messagesUnparsed = (await fetch(url, {
			method: 'GET',
		}).then((res) => res.json())) as Message[];

		const messagesUnparsedFiltered = messagesUnparsed.filter(
			async (message) => await verifyMessage(client, contact, message)
		);

		// Check if anyone has tried to send unsigned messages
		if (messagesUnparsed.length != messagesUnparsedFiltered.length) {
			console.log('Unsigned messages in conversation id!');
			console.log('Messages unparsed length = ' + messagesUnparsed.length);
			console.log(
				'Messages filtered length = ' + messagesUnparsedFiltered.length
			);
		}

		return (
			await Promise.all(
				messagesUnparsedFiltered.map(async (message, index) => {
					const parsedData: MessageData = JSON.parse(
						await decrypt(message.data, contact.sharedSecret)
					);

					parsedData.text = decodeURIComponent(escape(decode(parsedData.text)));

					return parsedData;
				})
			)
		).sort((a, b) => a.timestamp - b.timestamp);
	}

	const getContactMessages = (contact: Contact): MessageData[] => {
		return contactPKMessagesMap.get(contact.publicKey) ?? [];
	};

	const getMessages = async () => {
		for (let i = 0; i < contacts.length; i++) {
			const c = contacts[i];
			const messages = await fetchContactMessages(c);
			contactPKMessagesMap.set(c.publicKey, messages);
		}

		socket?.on(
			'new_message',
			async (conversationId: string, messageString: string) => {
				console.log(conversationId + ' got a new message.');

				// Find contact by conversation id:
				const contactsFiltered = contacts.filter(
					(c) => c.conversationId == conversationId
				);

				if (contactsFiltered.length == 0) {
					console.log('New message event contact not found!');
					return;
				}

				// Add received message to map
				const c = contactsFiltered[0];

				const message = JSON.parse(messageString);

				const parsedData: MessageData = JSON.parse(
					await decrypt(message.data, c.sharedSecret)
				);

				parsedData.text = decodeURIComponent(escape(decode(parsedData.text)));

				const currentMessages = getContactMessages(c);
				currentMessages.push(parsedData);
				contactPKMessagesMap.set(c.publicKey, currentMessages);

				setMessagesChanged(Math.random());
			}
		);
	};

	const sendMessage = async (contact: Contact, text: string) => {
		const message = await createMessage(client, contact, text);
		const url = `https://cipher.dk/chat/${contact.conversationId}/message/${contact.publicKey}`;

		// Post to api
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(message),
		});

		const messageData: MessageData = {
			senderPublicKey: client.publicKey,
			text,
			timestamp: new Date().getTime(),
		};

		const currentMessages = getContactMessages(contact);
		currentMessages.push(messageData);
		contactPKMessagesMap.set(contact.publicKey, currentMessages);
		setMessagesChanged(Math.random());

		//console.log(currentMessages[currentMessages.length - 1]);
	};

	return (
		<MessagesContext.Provider
			value={{ getMessages, getContactMessages, sendMessage, messagesChanged }}
		>
			{children}
		</MessagesContext.Provider>
	);
};
