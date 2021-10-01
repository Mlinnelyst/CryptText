const express = require('express');
const app = express();
app.use(express.json());
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const {
	get_conversation_messages,
	add_message_to_conversation,
} = require('./db');

app.get('/', (req, res) => {
	res.send('Server response.');
});

app.get('/chat/:conversation_id/message', (req, res) => {
	const conversation_id = req.params.conversation_id;
	console.log(conversation_id);

	const messages = get_conversation_messages(conversation_id);

	console.log(messages.length + ' messages fetched.');
	res.json(messages);
});

app.post('/chat/:conversation_id/message/:recipient_pk', (req, res) => {
	const conversation_id = req.params.conversation_id;
	const recipient_public_key = req.params.recipient_pk;
	console.log(conversation_id);
	console.log(recipient_public_key);
	const message = req.body;

	console.log(message);

	if (!message.data || !message.dataHash || !message.encryptedDataHash) {
		console.log('Invalid message body.');
		res.send('Message body invalid.');
		return;
	}

	add_message_to_conversation(conversation_id, message);

	console.log('Emitted new message event.');
	io.sockets.to(recipient_public_key).emit('new_message');

	res.send('Success.');
});

io.on('connection', (socket) => {
	console.log('a user connected');
	const public_key = socket.handshake.auth.public_key;

	if (!public_key) {
		socket.disconnect();
		return;
	}

	socket.join(public_key);

	// A client has scanned another clients public key and is now asking for a response
	socket.on('scanned_public_key', (scanned_public_key, clients_public_key) => {
		console.log('Public key scanned, awaiting confirmation.');
		console.log(scanned_public_key);
		socket
			.to(scanned_public_key)
			.emit('public_key_scanned', clients_public_key);
	});

	socket.on('confirm_public_key_scan', (scanned_by_public_key, public_key) => {
		console.log('Public key scan confirmed by client.');
		console.log(scanned_by_public_key);

		socket
			.to(scanned_by_public_key)
			.emit('public_key_scan_confirmed', public_key);
	});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

app.listen(3333, () => {
	console.log('Api listening on 3333');
});

server.listen(3334, () => {
	console.log('Socket listening on *:3334');
});
