import React, { useContext, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientKeyContext } from './ClientKeyProvider';

type SocketContextType = { socket: Socket };

export const SocketContext = React.createContext({} as SocketContextType);

interface SocketProviderProps {}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const { client } = useContext(ClientKeyContext);

	const socket = io(`${'http://cipher.dk'}`, {
		auth: {
			public_key: client.publicKey,
		},

		secure: true,
		rejectUnauthorized: false,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
	});

	socket.on('connect', () => {
		console.log('Socket connected.');
	});

	return (
		<SocketContext.Provider value={{ socket: socket }}>
			{children}
		</SocketContext.Provider>
	);
};
