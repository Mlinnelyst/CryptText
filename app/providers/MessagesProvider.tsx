import { decode } from 'base-64';
import React, { useContext, useEffect, useState } from 'react';
import { decrypt } from '../cryptography/encryption';
import {
	createMessage,
	Message,
	MessageData,
	verifyMessage,
} from '../cryptography/message';
import { ClientKeyContext } from './ClientKeyProvider';
import { Contact, ContactsContext } from './ContactsProvider';

type MessagesContextType = {
	getMessages(): Promise<void>;
	getContactMessages: (contact: Contact) => MessageData[];
	sendMessage: (contact: Contact, text: string) => Promise<void>;
};

export const MessagesContext = React.createContext({} as MessagesContextType);

interface MessagesProviderProps {}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({
	children,
}) => {
	const { client } = useContext(ClientKeyContext);
	const { contacts } = useContext(ContactsContext);

	const [contactPKMessagesMap] = useState(new Map<string, MessageData[]>());

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
		).sort((a, b) => b.timestamp - a.timestamp);
	}

	const getMessages = async () => {
		console.log('Contacts ' + contacts.length);
		for (let i = 0; i < contacts.length; i++) {
			const c = contacts[i];
			const messages = await fetchContactMessages(c);
			contactPKMessagesMap.set(c.publicKey, messages);
		}
	};

	const getContactMessages = (contact: Contact): MessageData[] => {
		return contactPKMessagesMap.get(contact.publicKey) ?? [];
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
	};

	return (
		<MessagesContext.Provider
			value={{ getMessages, getContactMessages, sendMessage }}
		>
			{children}
		</MessagesContext.Provider>
	);
};
