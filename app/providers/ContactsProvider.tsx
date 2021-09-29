import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { sha256 } from '../cryptography/hash';

export interface Contact {
	name: string;
	publicKey: string;
	sharedSecret: string;
	timestamp: number;
	conversationId: string;
	latestMessageText: string | undefined;
	latestMessageTs: number | undefined;
	latestMessageSentByUser: boolean;
}

type ContactsContextType = {
	contacts: Contact[];
	saveContacts(newContacts: Contact[]): Promise<void>;
	getContacts(): Promise<void>;
	getContact(publicKey: string): Promise<Contact | undefined>;
	createContact(publicKey: string, sharedSecret: string): Promise<void>;
	setContact(contact: Contact): Promise<void>;
};

export const ContactsContext = React.createContext({} as ContactsContextType);

interface ContactsProviderProps {}

export const ContactsProvider: React.FC<ContactsProviderProps> = ({
	children,
}) => {
	const [contacts, setContactsState] = useState<Contact[]>([]);

	const saveContacts = async (newContacts: Contact[]) => {
		setContactsState(newContacts);
		await AsyncStorage.setItem('contacts', JSON.stringify(newContacts));
	};

	const getContacts = async () => {
		/* setContactsState([
			{
				name: 'Some name1',
				publicKey: '12341',
				sharedSecret: 'abcdefg1',
				timestamp: new Date().getTime(),
				conversationId: await sha256('abcdefg1'),
				latestMessageText: 'Latest message1',
				latestMessageTs: new Date().getTime(),
				latestMessageSentByUser: true,
			},
			{
				name: 'Some name2',
				publicKey: '12342',
				sharedSecret: 'abcdefg2',
				timestamp: new Date().getTime(),
				conversationId: await sha256('abcdefg2'),
				latestMessageText: 'Latest message2',
				latestMessageTs: new Date().getTime(),
				latestMessageSentByUser: true,
			},
			{
				name: 'Some name3',
				publicKey: '12343',
				sharedSecret: 'abcdefg3',
				timestamp: new Date().getTime(),
				conversationId: await sha256('abcdefg3'),
				latestMessageText: 'Latest message3',
				latestMessageTs: new Date().getTime(),
				latestMessageSentByUser: true,
			},
		]); */

		var stored_contacts = await AsyncStorage.getItem('contacts');

		if (!stored_contacts) {
			await saveContacts([]);
			setContactsState([]);
		} else {
			setContactsState(JSON.parse(stored_contacts));
		}
	};

	const getContact = async (publicKey: string) => {
		return contacts.find((contact) => contact.publicKey == publicKey);
	};

	const createContact = async (publicKey: string, sharedSecret: string) => {
		if (await getContact(publicKey)) {
			console.log('Contact already exists!');
			return;
		}

		const contact: Contact = {
			name: 'New contact',
			publicKey,
			sharedSecret,
			timestamp: new Date().getTime(),
			conversationId: await sha256(sharedSecret),
			latestMessageText: undefined,
			latestMessageTs: undefined,
			latestMessageSentByUser: false,
		};

		const newContacts = contacts;
		newContacts.push(contact);
		await saveContacts(newContacts);
	};

	const setContact = async (contact: Contact) => {
		const newContacts = contacts;

		// Update contact name in the array
		const contact_index = newContacts.findIndex(
			(c) => c.publicKey == contact.publicKey
		);

		newContacts[contact_index] = contact;

		await saveContacts(newContacts);
	};

	return (
		<ContactsContext.Provider
			value={{
				contacts,
				saveContacts,
				getContacts,
				getContact,
				createContact,
				setContact,
			}}
		>
			{children}
		</ContactsContext.Provider>
	);
};
