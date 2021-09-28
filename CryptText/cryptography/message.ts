import { decrypt, encrypt } from './encryption';
import { encode } from 'base-64';
import { Client } from '../providers/ClientKeyProvider';
import { Contact } from '../providers/ContactsProvider';
import { sha256 } from './hash';

export interface Message {
	data: string;
	dataHash: string;
	encryptedDataHash: string;
	conversationId: string;
}

export interface MessageData {
	senderPublicKey: string;
	text: string;
	timestamp: number;
}

export async function create_message(
	client: Client,
	contact: Contact,
	text: string
): Promise<Message> {
	// Create message data from params
	const data: MessageData = {
		senderPublicKey: client.publicKey,
		text: encode(unescape(encodeURIComponent(text))),
		timestamp: new Date().getTime(),
	};

	// Calculate data hash
	const dataString = await encrypt(JSON.stringify(data), contact.sharedSecret);
	const dataHash = await sha256(dataString);

	// Encrypt data hash with shared secret
	const encryptedDataHash = await encrypt(dataHash, contact.sharedSecret);

	return {
		data: dataString,
		dataHash: dataHash,
		encryptedDataHash: encryptedDataHash,
		conversationId: contact.conversationId,
	};
}

export async function verify_message(
	client: Client,
	contact: Contact,
	message: Message
): Promise<boolean> {
	// Verify data hash
	const dataHash = await sha256(message.data);

	if (dataHash != message.dataHash) {
		console.log('Data hash invalid!');
		return false;
	}

	// Verify data hash encryption
	const encryptedDataHash = await encrypt(dataHash, contact.sharedSecret);

	if (encryptedDataHash != message.encryptedDataHash) {
		console.log('Encrypted data hash invalid!');
		return false;
	}

	const decryptedMessageData = await decrypt(
		message.data,
		contact.sharedSecret
	);

	// Verify json
	try {
		const messageDataParsed = JSON.parse(decryptedMessageData) as MessageData;

		// Verify public key is either client or contact
		if (
			messageDataParsed.senderPublicKey != client.publicKey &&
			messageDataParsed.senderPublicKey != contact.publicKey
		) {
			return false;
		}
	} catch {
		console.log('Parsing message data failed!');
		return false;
	}

	return true;
}